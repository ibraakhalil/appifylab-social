"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api/client";
import {
  createComment,
  getComments,
  getFeed,
  toggleCommentLike,
  togglePostLike,
} from "@/lib/api/posts";
import type { CommentItem, FeedPost } from "@/lib/api/types";

import FeedLoadingState from "./FeedLoadingState";
import FeedPostCard from "./FeedPostCard";
import { updateCommentLikeState } from "./feedUtils";

type PostCommentsState = Record<string, CommentItem[]>;

type FeedTimelineProps = {
  currentUserName: string;
  onUnauthorized: () => void;
  refreshKey: number;
};

export default function FeedTimeline({
  currentUserName,
  onUnauthorized,
  refreshKey,
}: FeedTimelineProps) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [commentsByPostId, setCommentsByPostId] = useState<PostCommentsState>({});
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadingCommentsForPostId, setLoadingCommentsForPostId] = useState<string | null>(null);

  const loadFeed = useCallback(async (cursor?: string | null) => {
    try {
      const response = await getFeed(cursor);
      setPosts((current) => (cursor ? [...current, ...response.items] : response.items));
      setNextCursor(response.nextCursor);
      setError(null);
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 401) {
        onUnauthorized();
        return;
      }

      setError(loadError instanceof Error ? loadError.message : "Unable to load feed.");
    } finally {
      setIsFeedLoading(false);
      setIsLoadingMore(false);
    }
  }, [onUnauthorized]);

  const loadCommentsForPost = useCallback(async (postId: string) => {
    setLoadingCommentsForPostId(postId);

    try {
      const response = await getComments(postId);
      setCommentsByPostId((current) => ({
        ...current,
        [postId]: response.items,
      }));
      setError(null);
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 401) {
        onUnauthorized();
        return;
      }

      setError(loadError instanceof Error ? loadError.message : "Unable to load comments.");
    } finally {
      setLoadingCommentsForPostId(null);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    setPosts([]);
    setCommentsByPostId({});
    setExpandedPostId(null);
    setCommentDrafts({});
    setReplyDrafts({});
    setActiveReplyId(null);
    setNextCursor(null);
    setError(null);
    setIsFeedLoading(true);
    setIsLoadingMore(false);
    setLoadingCommentsForPostId(null);

    void loadFeed();
  }, [loadFeed, refreshKey]);

  const handleTogglePostLike = async (postId: string) => {
    let previousPosts: FeedPost[] = [];

    setPosts((current) => {
      previousPosts = current;

      return current.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post,
      );
    });

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
        onUnauthorized();
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
        onUnauthorized();
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
        onUnauthorized();
        return;
      }

      setError(toggleError instanceof Error ? toggleError.message : "Unable to update comment like.");
    }
  };

  if (isFeedLoading) {
    return <FeedLoadingState />;
  }

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold text-ink">Top Posts</h2>
        <p className="mt-1 text-sm text-muted">Fresh conversations from the community</p>
      </div>

      {error ? (
        <div className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {posts.map((post) => (
        <FeedPostCard
          key={post.id}
          activeReplyId={activeReplyId}
          commentDraft={commentDrafts[post.id] ?? ""}
          comments={commentsByPostId[post.id] ?? []}
          currentUserName={currentUserName}
          isCommentsLoading={loadingCommentsForPostId === post.id}
          isExpanded={expandedPostId === post.id}
          onCommentDraftChange={(value) =>
            setCommentDrafts((current) => ({
              ...current,
              [post.id]: value,
            }))
          }
          onCommentLikeToggle={(commentId) => handleToggleCommentLike(post.id, commentId)}
          onCommentSubmit={() => handleCommentSubmit(post.id)}
          onLike={() => void handleTogglePostLike(post.id)}
          onReplyDraftChange={(commentId, value) => {
            setActiveReplyId(commentId);
            setReplyDrafts((current) => ({
              ...current,
              [commentId]: value,
            }));
          }}
          onReplySubmit={(parentId) => handleCommentSubmit(post.id, parentId)}
          onToggleComments={() => void handleToggleComments(post.id)}
          post={post}
          replyDrafts={replyDrafts}
        />
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
    </>
  );
}
