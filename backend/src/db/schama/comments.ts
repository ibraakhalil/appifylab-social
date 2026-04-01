import { sql } from "drizzle-orm";
import {
  type AnySQLiteColumn,
  index,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { posts } from "@/db/schama/posts";
import { users } from "@/db/schama/users";

export const comments = sqliteTable(
  "comments",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: text("parent_id").references(
      (): AnySQLiteColumn => comments.id,
      { onDelete: "cascade" },
    ),
    content: text("content").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("comments_post_id_idx").on(table.postId),
    index("comments_parent_id_idx").on(table.parentId),
  ],
);
