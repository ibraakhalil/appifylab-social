import { useState } from "react";

import { ApiError } from "@/lib/api/client";
import { getCommentLikes, getReplyLikes } from "@/lib/api/posts";
import Avatar from "@/components/ui/Avatar";
import type { ApiUser, CommentItem, ReplyItem } from "@/lib/api/types";

import ReactionUsersDialog from "./ReactionUsersDialog";
import { formatRelativeTime } from "./feedUtils";

type CommentThreadProps = {
  activeReplyId: string | null;
  comment: CommentItem;
  onUnauthorized: () => void;
  onReplyChange: (commentId: string, value: string) => void;
  onReplyLikeToggle: (replyId: string) => Promise<void>;
  onReplySubmit: (commentId: string) => Promise<void>;
  onToggleLike: (commentId: string) => Promise<void>;
  replyDrafts: Record<string, string>;
};

function ReplyCard({
  onUnauthorized,
  reply,
  onToggleLike,
}: {
  onUnauthorized: () => void;
  onToggleLike: (replyId: string) => Promise<void>;
  reply: ReplyItem;
}) {
  const [isReactionDialogOpen, setIsReactionDialogOpen] = useState(false);
  const [isReactionsLoading, setIsReactionsLoading] = useState(false);
  const [reactionError, setReactionError] = useState<string | null>(null);
  const [reactions, setReactions] = useState<ApiUser[]>([]);

  const handleReactionDialogChange = async (open: boolean) => {
    setIsReactionDialogOpen(open);

    if (!open || reactions.length || isReactionsLoading) {
      return;
    }

    setIsReactionsLoading(true);
    setReactionError(null);

    try {
      const response = await getReplyLikes(reply.id);
      setReactions(response.items);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized();
        return;
      }

      setReactionError(error instanceof Error ? error.message : "Unable to load reactions.");
    } finally {
      setIsReactionsLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Avatar name={`${reply.author.firstName} ${reply.author.lastName}`} className="h-9 w-9 text-sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-ink">
                {reply.author.firstName} {reply.author.lastName}
              </p>
              <span className="text-xs text-muted">{formatRelativeTime(reply.createdAt)}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{reply.content}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-muted">
              <button
                type="button"
                onClick={() => void onToggleLike(reply.id)}
                className={`transition ${reply.isLiked ? "text-accent" : "hover:text-ink"}`}
              >
                Like
              </button>
              <button
                type="button"
                onClick={() => void handleReactionDialogChange(true)}
                className="transition hover:text-ink"
              >
                {reply.likeCount} reactions
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReactionUsersDialog
        description="People who reacted to this reply."
        error={reactionError}
        isLoading={isReactionsLoading}
        onOpenChange={(open) => {
          void handleReactionDialogChange(open);
        }}
        open={isReactionDialogOpen}
        title="Reply reactions"
        users={reactions}
      />
    </>
  );
}

export default function CommentThread({
  activeReplyId,
  comment,
  onUnauthorized,
  onReplyChange,
  onReplyLikeToggle,
  onReplySubmit,
  onToggleLike,
  replyDrafts,
}: CommentThreadProps) {
  const [isReactionDialogOpen, setIsReactionDialogOpen] = useState(false);
  const [isReactionsLoading, setIsReactionsLoading] = useState(false);
  const [reactionError, setReactionError] = useState<string | null>(null);
  const [reactions, setReactions] = useState<ApiUser[]>([]);

  const handleReactionDialogChange = async (open: boolean) => {
    setIsReactionDialogOpen(open);

    if (!open || reactions.length || isReactionsLoading) {
      return;
    }

    setIsReactionsLoading(true);
    setReactionError(null);

    try {
      const response = await getCommentLikes(comment.id);
      setReactions(response.items);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized();
        return;
      }

      setReactionError(error instanceof Error ? error.message : "Unable to load reactions.");
    } finally {
      setIsReactionsLoading(false);
    }
  };

  return (
    <>
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
                  onClick={() => void onToggleLike(comment.id)}
                  className={`transition ${comment.isLiked ? "text-accent" : "hover:text-ink"}`}
                >
                  Like
                </button>
                <button
                  type="button"
                  onClick={() => void handleReactionDialogChange(true)}
                  className="transition hover:text-ink"
                >
                  {comment.likeCount} reactions
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
              <ReplyCard
                key={reply.id}
                onUnauthorized={onUnauthorized}
                reply={reply}
                onToggleLike={onReplyLikeToggle}
              />
            ))}
          </div>
        ) : null}
      </div>

      <ReactionUsersDialog
        description="People who reacted to this comment."
        error={reactionError}
        isLoading={isReactionsLoading}
        onOpenChange={(open) => {
          void handleReactionDialogChange(open);
        }}
        open={isReactionDialogOpen}
        title="Comment reactions"
        users={reactions}
      />
    </>
  );
}
