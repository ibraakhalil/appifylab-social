import { and, asc, desc, eq, lt, or, sql } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "@/db/client";
import { comments, likes, posts, users } from "@/db/schema";
import { badRequest, forbidden, notFound } from "@/lib/errors";
import { sanitizeText } from "@/lib/security";
import {
  createCommentSchema,
  createPostSchema,
  jsonValidator,
  postFeedQuerySchema,
  queryValidator,
} from "@/lib/validators";
import { authMiddleware } from "@/middlewares/auth";
import type { AppEnv } from "@/types/app";

type FeedCursor = {
  createdAt: string;
  id: string;
};

type CommentNode = {
  author: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
  };
  content: string;
  createdAt: string;
  id: string;
  isLiked: boolean;
  likeCount: number;
  parentId: string | null;
  replies: CommentNode[];
};

const encodeCursor = (cursor: FeedCursor) =>
  Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");

const decodeCursor = (cursor: string): FeedCursor => {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf8"),
    ) as Partial<FeedCursor>;

    if (typeof parsed.createdAt !== "string" || typeof parsed.id !== "string") {
      throw new Error("Invalid cursor.");
    }

    return {
      createdAt: parsed.createdAt,
      id: parsed.id,
    };
  } catch {
    throw badRequest("Invalid cursor.");
  }
};

const buildVisibilityFilter = (userId: string) =>
  or(eq(posts.visibility, "public"), eq(posts.authorId, userId));

const getVisiblePost = async (postId: string, userId: string) => {
  const post = await db.query.posts.findFirst({
    columns: {
      authorId: true,
      id: true,
      visibility: true,
    },
    where: eq(posts.id, postId),
  });

  if (!post) {
    throw notFound("Post not found.");
  }

  if (post.visibility === "private" && post.authorId !== userId) {
    throw forbidden("You cannot access this post.");
  }

  return post;
};

const buildCommentTree = (rows: Omit<CommentNode, "replies">[]) => {
  const byId = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const row of rows) {
    byId.set(row.id, {
      ...row,
      replies: [],
    });
  }

  for (const row of byId.values()) {
    if (!row.parentId) {
      roots.push(row);
      continue;
    }

    const parent = byId.get(row.parentId);

    if (parent) {
      parent.replies.push(row);
    } else {
      roots.push(row);
    }
  }

  return roots;
};

const postsRoutes = new Hono<AppEnv>();

postsRoutes.use("*", authMiddleware);

postsRoutes.get("/", queryValidator(postFeedQuerySchema), async (c) => {
  const authUser = c.get("authUser");
  const { cursor, limit } = c.req.valid("query");
  const decodedCursor = cursor ? decodeCursor(cursor) : null;
  const cursorFilter = decodedCursor
    ? or(
        lt(posts.createdAt, decodedCursor.createdAt),
        and(eq(posts.createdAt, decodedCursor.createdAt), lt(posts.id, decodedCursor.id)),
      )
    : undefined;

  const rows = await db
    .select({
      authorEmail: users.email,
      authorFirstName: users.firstName,
      authorId: users.id,
      authorLastName: users.lastName,
      commentCount: sql<number>`(
        select count(*)
        from ${comments}
        where ${comments.postId} = ${posts.id}
      )`.mapWith(Number),
      contentText: posts.contentText,
      createdAt: posts.createdAt,
      id: posts.id,
      imageUrl: posts.imageUrl,
      isLiked: sql<number>`exists(
        select 1
        from ${likes}
        where ${likes.targetId} = ${posts.id}
          and ${likes.targetType} = 'post'
          and ${likes.userId} = ${authUser.userId}
      )`.mapWith(Number),
      likeCount: sql<number>`(
        select count(*)
        from ${likes}
        where ${likes.targetId} = ${posts.id}
          and ${likes.targetType} = 'post'
      )`.mapWith(Number),
      visibility: posts.visibility,
    })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.authorId))
    .where(
      cursorFilter
        ? and(buildVisibilityFilter(authUser.userId), cursorFilter)
        : buildVisibilityFilter(authUser.userId),
    )
    .orderBy(desc(posts.createdAt), desc(posts.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit).map((row) => ({
    author: {
      email: row.authorEmail,
      firstName: row.authorFirstName,
      id: row.authorId,
      lastName: row.authorLastName,
    },
    commentCount: row.commentCount,
    contentText: row.contentText,
    createdAt: row.createdAt,
    id: row.id,
    imageUrl: row.imageUrl,
    isLiked: Boolean(row.isLiked),
    likeCount: row.likeCount,
    visibility: row.visibility,
  }));

  const lastItem = items.at(-1);

  return c.json({
    items,
    nextCursor:
      hasMore && lastItem
        ? encodeCursor({
            createdAt: lastItem.createdAt,
            id: lastItem.id,
          })
        : null,
  });
});

postsRoutes.post("/", jsonValidator(createPostSchema), async (c) => {
  const authUser = c.get("authUser");
  const payload = c.req.valid("json");
  const contentText = payload.contentText ? sanitizeText(payload.contentText) : null;
  const imageUrl = payload.imageUrl?.trim() ?? null;

  if (!contentText && !imageUrl) {
    throw badRequest("A post must contain text, an image URL, or both.");
  }

  const postId = crypto.randomUUID();

  await db.insert(posts).values({
    authorId: authUser.userId,
    contentText,
    createdAt: new Date().toISOString(),
    id: postId,
    imageUrl,
    visibility: payload.visibility,
  });

  return c.json(
    {
      id: postId,
      message: "Post created successfully.",
    },
    201,
  );
});

postsRoutes.get("/:id/likes", async (c) => {
  const authUser = c.get("authUser");
  const postId = c.req.param("id");

  await getVisiblePost(postId, authUser.userId);

  const items = await db
    .select({
      email: users.email,
      firstName: users.firstName,
      id: users.id,
      lastName: users.lastName,
    })
    .from(likes)
    .innerJoin(users, eq(users.id, likes.userId))
    .where(and(eq(likes.targetId, postId), eq(likes.targetType, "post")))
    .orderBy(asc(users.firstName), asc(users.lastName));

  return c.json({ items });
});

postsRoutes.post("/:id/like", async (c) => {
  const authUser = c.get("authUser");
  const postId = c.req.param("id");

  await getVisiblePost(postId, authUser.userId);

  const result = await db.transaction(async (tx) => {
    const existingLike = await tx.query.likes.findFirst({
      columns: {
        id: true,
      },
      where: and(
        eq(likes.targetId, postId),
        eq(likes.targetType, "post"),
        eq(likes.userId, authUser.userId),
      ),
    });

    if (existingLike) {
      await tx.delete(likes).where(eq(likes.id, existingLike.id));
      return { liked: false };
    }

    await tx.insert(likes).values({
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      targetId: postId,
      targetType: "post",
      userId: authUser.userId,
    });

    return { liked: true };
  });

  const likeCount = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(likes)
    .where(and(eq(likes.targetId, postId), eq(likes.targetType, "post")));

  return c.json({
    isLiked: result.liked,
    likeCount: likeCount[0]?.count ?? 0,
  });
});

postsRoutes.get("/:id/comments", async (c) => {
  const authUser = c.get("authUser");
  const postId = c.req.param("id");

  await getVisiblePost(postId, authUser.userId);

  const rows = await db
    .select({
      authorEmail: users.email,
      authorFirstName: users.firstName,
      authorId: users.id,
      authorLastName: users.lastName,
      content: comments.content,
      createdAt: comments.createdAt,
      id: comments.id,
      isLiked: sql<number>`exists(
        select 1
        from ${likes}
        where ${likes.targetId} = ${comments.id}
          and ${likes.targetType} = 'comment'
          and ${likes.userId} = ${authUser.userId}
      )`.mapWith(Number),
      likeCount: sql<number>`(
        select count(*)
        from ${likes}
        where ${likes.targetId} = ${comments.id}
          and ${likes.targetType} = 'comment'
      )`.mapWith(Number),
      parentId: comments.parentId,
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.authorId))
    .where(eq(comments.postId, postId))
    .orderBy(asc(comments.createdAt), asc(comments.id));

  const items = buildCommentTree(
    rows.map((row) => ({
      author: {
        email: row.authorEmail,
        firstName: row.authorFirstName,
        id: row.authorId,
        lastName: row.authorLastName,
      },
      content: row.content,
      createdAt: row.createdAt,
      id: row.id,
      isLiked: Boolean(row.isLiked),
      likeCount: row.likeCount,
      parentId: row.parentId,
    })),
  );

  return c.json({ items });
});

postsRoutes.post("/:id/comments", jsonValidator(createCommentSchema), async (c) => {
  const authUser = c.get("authUser");
  const postId = c.req.param("id");
  const payload = c.req.valid("json");

  await getVisiblePost(postId, authUser.userId);

  if (payload.parentId) {
    const parent = await db.query.comments.findFirst({
      columns: {
        id: true,
        postId: true,
      },
      where: eq(comments.id, payload.parentId),
    });

    if (!parent || parent.postId !== postId) {
      throw badRequest("parentId must belong to the same post.");
    }
  }

  const content = sanitizeText(payload.content);

  if (!content) {
    throw badRequest("Comment content cannot be empty.");
  }

  const commentId = crypto.randomUUID();

  await db.insert(comments).values({
    authorId: authUser.userId,
    content,
    createdAt: new Date().toISOString(),
    id: commentId,
    parentId: payload.parentId ?? null,
    postId,
  });

  return c.json(
    {
      id: commentId,
      message: payload.parentId
        ? "Reply created successfully."
        : "Comment created successfully.",
    },
    201,
  );
});

export default postsRoutes;
