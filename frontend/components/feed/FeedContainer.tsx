"use client";

/* eslint-disable @next/next/no-img-element */

import { type FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { stories } from "@/app/data/mock";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import {
  createComment,
  createPost,
  getComments,
  getFeed,
  toggleCommentLike,
  togglePostLike,
} from "@/lib/api/posts";
import type { CommentItem, FeedPost } from "@/lib/api/types";
import {
  CalendarDays,
  Globe2,
  ImagePlus,
  LoaderCircle,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  ThumbsUp,
  Video,
} from "lucide-react";

type PostCommentsState = Record<string, CommentItem[]>;

const formatRelativeTime = (value: string) => {
  const date = new Date(value);
  const diffInSeconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString();
};

const updateCommentLikeState = (
  items: CommentItem[],
  commentId: string,
  nextState: { isLiked: boolean; likeCount: number },
): CommentItem[] =>
  items.map((item) => {
    if (item.id === commentId) {
      return {
        ...item,
        isLiked: nextState.isLiked,
        likeCount: nextState.likeCount,
      };
    }

    if (!item.replies.length) {
      return item;
    }

    return {
      ...item,
      replies: updateCommentLikeState(item.replies, commentId, nextState),
    };
  });

function CommentThread({
  activeReplyId,
  comment,
  onReplyChange,
  onReplySubmit,
  onToggleLike,
  replyDrafts,
}: {
  activeReplyId: string | null;
  comment: CommentItem;
  onReplyChange: (commentId: string, value: string) => void;
  onReplySubmit: (parentId: string) => Promise<void>;
  onToggleLike: (commentId: string) => Promise<void>;
  replyDrafts: Record<string, string>;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-surface-muted p-4">
        <div className="flex items-start gap-3">
          <Avatar name={`${comment.author.firstName} ${comment.author.lastName}`} className="h-10 w-10 text-sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-ink">
                {comment.author.firstName} {comment.author.lastName}
              </p>
              <span className="text-xs text-muted">{formatRelativeTime(comment.createdAt)}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{comment.content}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-muted">
              <button
                type="button"
                onClick={() => onToggleLike(comment.id)}
                className={`transition ${comment.isLiked ? "text-accent" : "hover:text-ink"}`}
              >
                Like ({comment.likeCount})
              </button>
              <button
                type="button"
                onClick={() => onReplyChange(comment.id, replyDrafts[comment.id] ?? "")}
                className="transition hover:text-ink"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeReplyId === comment.id ? (
        <form
          className="ml-6 flex gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void onReplySubmit(comment.id);
          }}
        >
          <input
            value={replyDrafts[comment.id] ?? ""}
            onChange={(event) => onReplyChange(comment.id, event.target.value)}
            placeholder="Write a reply..."
            className="h-11 flex-1 rounded-full border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent/50"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong"
          >
            Reply
          </button>
        </form>
      ) : null}

      {comment.replies.length ? (
        <div className="ml-6 space-y-3 border-l border-line pl-4">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              activeReplyId={activeReplyId}
              comment={reply}
              onReplyChange={onReplyChange}
              onReplySubmit={onReplySubmit}
              onToggleLike={onToggleLike}
              replyDrafts={replyDrafts}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function FeedContainer() {
  const router = useRouter();
  const { isAuthenticated, isReady, logout, user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [commentsByPostId, setCommentsByPostId] = useState<PostCommentsState>({});
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [composer, setComposer] = useState({
    contentText: "",
    imageUrl: "",
    visibility: "public" as "public" | "private",
  });
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadingCommentsForPostId, setLoadingCommentsForPostId] = useState<string | null>(null);

  const handleUnauthorized = useCallback(() => {
    logout();
    router.replace("/login");
  }, [logout, router]);

  const loadFeed = useCallback(async (cursor?: string | null) => {
    try {
      const response = await getFeed(cursor);
      setPosts((current) => (cursor ? [...current, ...response.items] : response.items));
      setNextCursor(response.nextCursor);
      setError(null);
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(loadError instanceof Error ? loadError.message : "Unable to load feed.");
    } finally {
      setIsFeedLoading(false);
      setIsLoadingMore(false);
    }
  }, [handleUnauthorized]);

  const loadCommentsForPost = async (postId: string) => {
    setLoadingCommentsForPostId(postId);

    try {
      const response = await getComments(postId);
      setCommentsByPostId((current) => ({
        ...current,
        [postId]: response.items,
      }));
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(loadError instanceof Error ? loadError.message : "Unable to load comments.");
    } finally {
      setLoadingCommentsForPostId(null);
    }
  };

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    void loadFeed();
  }, [isAuthenticated, isReady, loadFeed, router]);

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!composer.contentText.trim() && !composer.imageUrl.trim()) {
      setError("Write something or add an image URL before posting.");
      return;
    }

    setIsSubmittingPost(true);

    try {
      await createPost({
        contentText: composer.contentText.trim() || undefined,
        imageUrl: composer.imageUrl.trim() || undefined,
        visibility: composer.visibility,
      });

      setComposer({
        contentText: "",
        imageUrl: "",
        visibility: "public",
      });

      setIsFeedLoading(true);
      await loadFeed();
    } catch (submissionError) {
      if (submissionError instanceof ApiError && submissionError.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to create post.",
      );
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleTogglePostLike = async (postId: string) => {
    const previousPosts = posts;

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post,
      ),
    );

    try {
      const response = await togglePostLike(postId);
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: response.isLiked,
                likeCount: response.likeCount,
              }
            : post,
        ),
      );
    } catch (toggleError) {
      setPosts(previousPosts);

      if (toggleError instanceof ApiError && toggleError.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(toggleError instanceof Error ? toggleError.message : "Unable to update like.");
    }
  };

  const handleToggleComments = async (postId: string) => {
    const willExpand = expandedPostId !== postId;
    setExpandedPostId(willExpand ? postId : null);
    setActiveReplyId(null);

    if (willExpand && !commentsByPostId[postId]) {
      await loadCommentsForPost(postId);
    }
  };

  const handleCommentDraftChange = (postId: string, value: string) => {
    setCommentDrafts((current) => ({
      ...current,
      [postId]: value,
    }));
  };

  const handleReplyDraftChange = (commentId: string, value: string) => {
    setActiveReplyId(commentId);
    setReplyDrafts((current) => ({
      ...current,
      [commentId]: value,
    }));
  };

  const handleCommentSubmit = async (postId: string, parentId?: string) => {
    const value = parentId ? replyDrafts[parentId] ?? "" : commentDrafts[postId] ?? "";

    if (!value.trim()) {
      return;
    }

    try {
      await createComment(postId, {
        content: value.trim(),
        parentId,
      });

      if (parentId) {
        setReplyDrafts((current) => ({
          ...current,
          [parentId]: "",
        }));
        setActiveReplyId(null);
      } else {
        setCommentDrafts((current) => ({
          ...current,
          [postId]: "",
        }));
      }

      await loadCommentsForPost(postId);
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                commentCount: post.commentCount + 1,
              }
            : post,
        ),
      );
    } catch (submissionError) {
      if (submissionError instanceof ApiError && submissionError.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to add comment.",
      );
    }
  };

  const handleToggleCommentLike = async (postId: string, commentId: string) => {
    try {
      const response = await toggleCommentLike(commentId);
      setCommentsByPostId((current) => ({
        ...current,
        [postId]: updateCommentLikeState(current[postId] ?? [], commentId, response),
      }));
    } catch (toggleError) {
      if (toggleError instanceof ApiError && toggleError.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(toggleError instanceof Error ? toggleError.message : "Unable to update comment like.");
    }
  };

  if (!isReady || isFeedLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_45px_rgba(17,32,50,0.08)]">
        <div className="flex items-center gap-3 text-sm font-medium text-muted">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading your feed...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5">
        <div className="flex items-start gap-3">
          <Avatar
            name={user ? `${user.firstName} ${user.lastName}` : "User"}
            className="mt-1 h-11 w-11 text-sm"
          />
          <form className="flex-1 space-y-3" onSubmit={handleCreatePost}>
            <textarea
              value={composer.contentText}
              onChange={(event) =>
                setComposer((current) => ({
                  ...current,
                  contentText: event.target.value,
                }))
              }
              className="min-h-28 w-full rounded-[24px] border border-transparent bg-surface-muted px-5 py-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:bg-white"
              placeholder={`What’s on your mind, ${user?.firstName ?? "there"}?`}
            />

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
              <input
                value={composer.imageUrl}
                onChange={(event) =>
                  setComposer((current) => ({
                    ...current,
                    imageUrl: event.target.value,
                  }))
                }
                className="h-12 rounded-full border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent/50"
                type="url"
                placeholder="Image URL (optional)"
              />
              <select
                value={composer.visibility}
                onChange={(event) =>
                  setComposer((current) => ({
                    ...current,
                    visibility: event.target.value as "public" | "private",
                  }))
                }
                className="h-12 rounded-full border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent/50"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-4 gap-2 border-t border-line/70 pt-4">
              <button className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink" type="button">
                <Video className="h-4 w-4 text-accent" />
                Live
              </button>
              <button className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink" type="button">
                <ImagePlus className="h-4 w-4 text-success" />
                Photo
              </button>
              <button className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink" type="button">
                <CalendarDays className="h-4 w-4 text-[#fb8c00]" />
                Event
              </button>
              <button
                className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-accent/60"
                type="submit"
                disabled={isSubmittingPost}
              >
                {isSubmittingPost ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink">Stories</h2>
          <p className="mt-1 text-sm text-muted">Quick updates from your network</p>
        </div>
        <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2">
          {stories.map((story) => (
            <article
              key={story.id}
              className="relative h-[214px] w-[146px] shrink-0 overflow-hidden rounded-[26px] bg-ink"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1d4ed8] to-[#60a5fa]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#112032] via-[#112032]/50 to-transparent" />
              {story.isAdd ? (
                <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-between p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-white shadow-lg">
                    <Plus className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-5 text-white">Create Story</p>
                    <p className="mt-1 text-xs text-white/70">Share a new update</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-between p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-white bg-white/15 backdrop-blur">
                    <Avatar name={story.name} className="h-8 w-8 text-[10px]" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-5 text-white">{story.name}</p>
                    <p className="mt-1 text-xs text-white/70">Tap to view story</p>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <div>
        <h2 className="text-lg font-semibold text-ink">Top Posts</h2>
        <p className="mt-1 text-sm text-muted">Fresh conversations from the community</p>
      </div>

      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="#" className="shrink-0">
                <Avatar
                  name={`${post.author.firstName} ${post.author.lastName}`}
                  className="h-11 w-11 text-sm"
                />
              </Link>
              <div className="min-w-0">
                <Link href="#" className="block text-sm font-semibold text-ink">
                  {post.author.firstName} {post.author.lastName}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <span>{formatRelativeTime(post.createdAt)}</span>
                  <span className="h-1 w-1 rounded-full bg-subtle" />
                  <span className="inline-flex items-center gap-1">
                    {post.visibility === "public" ? (
                      <Globe2 className="h-3.5 w-3.5" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                    {post.visibility === "public" ? "Public" : "Private"}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-muted transition hover:bg-accent/10 hover:text-accent"
              type="button"
              aria-label="More post options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {post.contentText ? <p className="text-sm leading-7 text-muted">{post.contentText}</p> : null}
            {post.imageUrl ? (
              <div className="overflow-hidden rounded-[24px] border border-line/70">
                <img src={post.imageUrl} alt="" className="h-auto w-full object-cover" loading="lazy" />
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-b border-line/70 pb-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                <ThumbsUp className="h-4 w-4" />
              </span>
              <span className="font-medium text-ink">{post.likeCount} reactions</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{post.commentCount} comments</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                post.isLiked
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-surface-muted hover:text-ink"
              }`}
              type="button"
              onClick={() => void handleTogglePostLike(post.id)}
            >
              <ThumbsUp className="h-4 w-4" />
              Like
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink"
              type="button"
              onClick={() => void handleToggleComments(post.id)}
            >
              <MessageCircle className="h-4 w-4" />
              Comment
            </button>
            <button className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink" type="button">
              <Send className="h-4 w-4" />
              Share
            </button>
          </div>

          {expandedPostId === post.id ? (
            <div className="mt-5 space-y-4 border-t border-line/70 pt-4">
              <form
                className="flex gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleCommentSubmit(post.id);
                }}
              >
                <Avatar
                  name={user ? `${user.firstName} ${user.lastName}` : "User"}
                  className="h-10 w-10 shrink-0 text-sm"
                />
                <input
                  value={commentDrafts[post.id] ?? ""}
                  onChange={(event) => handleCommentDraftChange(post.id, event.target.value)}
                  placeholder="Write a comment..."
                  className="h-11 flex-1 rounded-full border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent/50"
                />
                <button
                  type="submit"
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong"
                >
                  Send
                </button>
              </form>

              {loadingCommentsForPostId === post.id ? (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Loading comments...
                </div>
              ) : commentsByPostId[post.id]?.length ? (
                <div className="space-y-4">
                  {commentsByPostId[post.id].map((comment) => (
                    <CommentThread
                      key={comment.id}
                      activeReplyId={activeReplyId}
                      comment={comment}
                      onReplyChange={handleReplyDraftChange}
                      onReplySubmit={(parentId) => handleCommentSubmit(post.id, parentId)}
                      onToggleLike={(commentId) => handleToggleCommentLike(post.id, commentId)}
                      replyDrafts={replyDrafts}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No comments yet. Start the conversation.</p>
              )}
            </div>
          ) : null}
        </article>
      ))}

      {nextCursor ? (
        <button
          type="button"
          onClick={() => {
            setIsLoadingMore(true);
            void loadFeed(nextCursor);
          }}
          disabled={isLoadingMore}
          className="w-full rounded-[24px] border border-line bg-white px-5 py-4 text-sm font-semibold text-ink shadow-[0_18px_45px_rgba(17,32,50,0.08)] transition hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoadingMore ? "Loading more..." : "Load more posts"}
        </button>
      ) : null}
    </div>
  );
}
