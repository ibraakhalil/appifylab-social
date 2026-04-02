import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";

import type { AppEnv } from "@/types/app";
import { AppError } from "@/lib/errors";
import { env } from "@/lib/env";
import { jsonError } from "@/lib/http";
import authRoutes from "@/routes/auth";
import commentsRoutes from "@/routes/comments";
import postsRoutes from "@/routes/posts";
import repliesRoutes from "@/routes/replies";
import usersRoutes from "@/routes/users";

const app = new Hono<AppEnv>();

app.use(
  "/public/*",
  serveStatic({
    rewriteRequestPath: (path) => path.replace(/^\//, ""),
    root: "./",
  }),
);

app.use(
  "*",
  cors({
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    origin: env.corsOrigins,
  }),
);

app.get("/", (c) =>
  c.json({
    message: "AppifyLab Social API is running.",
  }),
);

app.get("/health", (c) =>
  c.json({
    status: "ok",
  }),
);

app.route("/auth", authRoutes);
app.route("/posts", postsRoutes);
app.route("/comments", commentsRoutes);
app.route("/replies", repliesRoutes);
app.route("/users", usersRoutes);

app.notFound((c) => jsonError(c, 404, "Route not found."));

app.onError((error, c) => {
  if (error instanceof AppError) {
    return jsonError(c, error.statusCode, error.message);
  }

  console.error(error);
  return jsonError(c, 500, "Internal server error.");
});

export default app;
