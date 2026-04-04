"use client";

import type { QueryKey } from "@tanstack/react-query";

import type { FeedResponse } from "@/lib/api/types";
import { useInfiniteFeedQuery } from "@/lib/query/feed";
import { isUnauthorizedApiError } from "@/lib/query/utils";

import FeedPostCard from "./FeedPostCard";
import FeedSkeleton from "./FeedSkeleton";

type FeedTimelineProps = {
  currentUserName: string;
  emptyStateMessage?: string;
  loadPosts: (cursor?: string | null) => Promise<FeedResponse>;
  loadMoreLabel?: string;
  onUnauthorized: () => void;
  queryKey: QueryKey;
};

export default function FeedTimeline({
  currentUserName,
  emptyStateMessage = "No posts yet.",
  loadPosts,
  loadMoreLabel = "Load more posts",
  onUnauthorized,
  queryKey,
}: FeedTimelineProps) {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteFeedQuery({
      loadPosts,
      onUnauthorized,
      queryKey,
    });

  if (isPending) {
    return <FeedSkeleton postCount={2} showComposer={false} showStories={false} />;
  }

  const posts = data?.pages.flatMap((page) => page.items) ?? [];
  const errorMessage =
    error && !isUnauthorizedApiError(error)
      ? error instanceof Error
        ? error.message
        : "Unable to load feed."
      : null;

  return (
    <>
      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {posts.map((post) => (
        <FeedPostCard key={post.id} currentUserName={currentUserName} onUnauthorized={onUnauthorized} post={post} />
      ))}

      {!posts.length && !hasNextPage ? (
        <div className="border-line rounded-2xl border bg-white px-5 py-10 text-center shadow-[0_18px_45px_rgba(17,32,50,0.08)]">
          <p className="text-ink text-sm font-medium">{emptyStateMessage}</p>
        </div>
      ) : null}

      {hasNextPage ? (
        <button
          type="button"
          onClick={() => {
            void fetchNextPage();
          }}
          disabled={isFetchingNextPage}
          className="border-line text-ink hover:border-accent/40 hover:text-accent w-full rounded-lg border bg-white px-5 py-4 text-sm font-semibold shadow-[0_18px_45px_rgba(17,32,50,0.08)] transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isFetchingNextPage ? "Loading more..." : loadMoreLabel}
        </button>
      ) : null}
    </>
  );
}
