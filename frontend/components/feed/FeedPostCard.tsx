/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  Globe2,
  LoaderCircle,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Send,
  ThumbsUp,
} from "lucide-react";

import type { ApiUser, CommentItem, FeedPost } from "@/lib/api/types";
import Avatar from "@/components/ui/Avatar";

import CommentThread from "./CommentThread";
import ReactionUsersDialog from "./ReactionUsersDialog";
import { buildProfileHref, formatRelativeTime } from "./feedUtils";

type FeedPostCardProps = {
  activeReplyId: string | null;
  commentDraft: string;
  comments: CommentItem[];
  currentUserName: string;
  isCommentsLoading: boolean;
  isExpanded: boolean;
  isReactionsLoading: boolean;
  onCommentDraftChange: (value: string) => void;
  onCommentLikeToggle: (commentId: string) => Promise<void>;
  onCommentSubmit: () => Promise<void>;
  onLike: () => void;
  onReplyLikeToggle: (replyId: string) => Promise<void>;
  onReplyDraftChange: (commentId: string, value: string) => void;
  onReplySubmit: (commentId: string) => Promise<void>;
  onToggleComments: () => void;
  onUnauthorized: () => void;
  onReactionDialogChange: (open: boolean) => void;
  post: FeedPost;
  reactions: ApiUser[];
  replyDrafts: Record<string, string>;
  showReactionDialog: boolean;
};

export default function FeedPostCard({
  activeReplyId,
  commentDraft,
  comments,
  currentUserName,
  isCommentsLoading,
  isExpanded,
  isReactionsLoading,
  onCommentDraftChange,
  onCommentLikeToggle,
  onCommentSubmit,
  onLike,
  onReplyLikeToggle,
  onReplyDraftChange,
  onReplySubmit,
  onToggleComments,
  onUnauthorized,
  onReactionDialogChange,
  post,
  reactions,
  replyDrafts,
  showReactionDialog,
}: FeedPostCardProps) {
  const visibilityLabel = post.visibility === "public" ? "Public" : "Private";

  return (
    <>
      <article className="rounded-2xl border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={buildProfileHref(post.author.id)} className="shrink-0">
              <Avatar name={`${post.author.firstName} ${post.author.lastName}`} className="h-11 w-11 text-sm" />
            </Link>
            <div className="min-w-0">
              <Link
                href={buildProfileHref(post.author.id)}
                className="block text-sm font-semibold text-ink transition hover:text-accent"
              >
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
                  {visibilityLabel}
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
            <div className="overflow-hidden rounded-lg border border-line/70">
              <img src={post.imageUrl} alt="" className="h-auto w-full object-cover" loading="lazy" />
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-b border-line/70 pb-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
              <ThumbsUp className="h-4 w-4" />
            </span>
            <button
              type="button"
              onClick={() => onReactionDialogChange(true)}
              className="font-medium text-ink transition hover:text-accent"
            >
              {post.likeCount} reactions
            </button>
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
            onClick={onLike}
          >
            <ThumbsUp className="h-4 w-4" />
            Like
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink"
            type="button"
            onClick={onToggleComments}
          >
            <MessageCircle className="h-4 w-4" />
            Comment
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink" type="button">
            <Send className="h-4 w-4" />
            Share
          </button>
        </div>

        {isExpanded ? (
          <div className="mt-5 space-y-4 border-t border-line/70 pt-4">
            <form
              className="flex gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                void onCommentSubmit();
              }}
            >
              <Avatar name={currentUserName} className="h-10 w-10 shrink-0 text-sm" />
              <input
                value={commentDraft}
                onChange={(event) => onCommentDraftChange(event.target.value)}
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

            {isCommentsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading comments...
              </div>
            ) : comments.length ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentThread
                    key={comment.id}
                    activeReplyId={activeReplyId}
                    comment={comment}
                    onUnauthorized={onUnauthorized}
                    onReplyChange={onReplyDraftChange}
                    onReplyLikeToggle={onReplyLikeToggle}
                    onReplySubmit={onReplySubmit}
                    onToggleLike={onCommentLikeToggle}
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

      <ReactionUsersDialog
        description="People who reacted to this post."
        error={null}
        isLoading={isReactionsLoading}
        onOpenChange={onReactionDialogChange}
        open={showReactionDialog}
        title="Reactions"
        users={reactions}
      />
    </>
  );
}
