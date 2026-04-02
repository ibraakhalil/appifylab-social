"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api/client";
import {
  createComment,
  createReply,
  getComments,
  getFeed,
  getPostLikes,
  toggleCommentLike,
  togglePostLike,
  toggleReplyLike,
} from "@/lib/api/posts";
import type { ApiUser, CommentItem, FeedPost } from "@/lib/api/types";

import FeedLoadingState from "./FeedLoadingState";
import FeedPostCard from "./FeedPostCard";
import { updateCommentLikeState, updateReplyLikeState } from "./feedUtils";

type PostCommentsState = Record<string, CommentItem[]>;
type PostReactionsState = Record<string, ApiUser[]>;

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
  const [reactionsByPostId, setReactionsByPostId] = useState<PostReactionsState>({});
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [reactionDialogPostId, setReactionDialogPostId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadingCommentsForPostId, setLoadingCommentsForPostId] = useState<string | null>(null);
  const [loadingReactionsForPostId, setLoadingReactionsForPostId] = useState<string | null>(null);

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

  const loadReactionsForPost = useCallback(async (postId: string) => {
    setLoadingReactionsForPostId(postId);

    try {
      const response = await getPostLikes(postId);
      setReactionsByPostId((current) => ({
        ...current,
        [postId]: response.items,
      }));
      setError(null);
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 401) {
        onUnauthorized();
        return;
      }

      setError(loadError instanceof Error ? loadError.message : "Unable to load reactions.");
    } finally {
      setLoadingReactionsForPostId(null);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    setPosts([]);
    setCommentsByPostId({});
    setReactionsByPostId({});
    setExpandedPostId(null);
    setReactionDialogPostId(null);
    setCommentDrafts({});
    setReplyDrafts({});
    setActiveReplyId(null);
    setNextCursor(null);
    setError(null);
    setIsFeedLoading(true);
    setIsLoadingMore(false);
    setLoadingCommentsForPostId(null);
    setLoadingReactionsForPostId(null);

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

  const handleReactionDialogChange = async (postId: string, open: boolean) => {
    setReactionDialogPostId(open ? postId : null);

    if (open && !reactionsByPostId[postId]) {
      await loadReactionsForPost(postId);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const value = commentDrafts[postId] ?? "";

    if (!value.trim()) {
      return;
    }

    try {
      await createComment(postId, {
        content: value.trim(),
      });

      setCommentDrafts((current) => ({
        ...current,
        [postId]: "",
      }));

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

  const handleReplySubmit = async (postId: string, commentId: string) => {
    const value = replyDrafts[commentId] ?? "";

    if (!value.trim()) {
      return;
    }

    try {
      await createReply(commentId, {
        content: value.trim(),
      });

      setReplyDrafts((current) => ({
        ...current,
        [commentId]: "",
      }));
      setActiveReplyId(null);

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
        submissionError instanceof Error ? submissionError.message : "Unable to add reply.",
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

  const handleToggleReplyLike = async (postId: string, replyId: string) => {
    try {
      const response = await toggleReplyLike(replyId);
      setCommentsByPostId((current) => ({
        ...current,
        [postId]: updateReplyLikeState(current[postId] ?? [], replyId, response),
      }));
    } catch (toggleError) {
      if (toggleError instanceof ApiError && toggleError.status === 401) {
        onUnauthorized();
        return;
      }

      setError(toggleError instanceof Error ? toggleError.message : "Unable to update reply like.");
    }
  };

  if (isFeedLoading) {
    return <FeedLoadingState />;
  }

  return (
    <>


      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
          isReactionsLoading={loadingReactionsForPostId === post.id}
          onCommentDraftChange={(value) =>
            setCommentDrafts((current) => ({
              ...current,
              [post.id]: value,
            }))
          }
          onCommentLikeToggle={(commentId) => handleToggleCommentLike(post.id, commentId)}
          onCommentSubmit={() => handleCommentSubmit(post.id)}
          onLike={() => void handleTogglePostLike(post.id)}
          onReplyLikeToggle={(replyId) => handleToggleReplyLike(post.id, replyId)}
          onReplyDraftChange={(commentId, value) => {
            setActiveReplyId(commentId);
            setReplyDrafts((current) => ({
              ...current,
              [commentId]: value,
            }));
          }}
          onReplySubmit={(commentId) => handleReplySubmit(post.id, commentId)}
          onToggleComments={() => void handleToggleComments(post.id)}
          onUnauthorized={onUnauthorized}
          onReactionDialogChange={(open) => void handleReactionDialogChange(post.id, open)}
          post={post}
          reactions={reactionsByPostId[post.id] ?? []}
          replyDrafts={replyDrafts}
          showReactionDialog={reactionDialogPostId === post.id}
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
          className="w-full rounded-lg border border-line bg-white px-5 py-4 text-sm font-semibold text-ink shadow-[0_18px_45px_rgba(17,32,50,0.08)] transition hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoadingMore ? "Loading more..." : "Load more posts"}
        </button>
      ) : null}
    </>
  );
}
