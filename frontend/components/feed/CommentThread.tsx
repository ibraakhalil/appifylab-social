import Avatar from "@/components/ui/Avatar";
import type { CommentItem } from "@/lib/api/types";

import { formatRelativeTime } from "./feedUtils";

type CommentThreadProps = {
  activeReplyId: string | null;
  comment: CommentItem;
  onReplyChange: (commentId: string, value: string) => void;
  onReplySubmit: (parentId: string) => Promise<void>;
  onToggleLike: (commentId: string) => Promise<void>;
  replyDrafts: Record<string, string>;
};

export default function CommentThread({
  activeReplyId,
  comment,
  onReplyChange,
  onReplySubmit,
  onToggleLike,
  replyDrafts,
}: CommentThreadProps) {
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
                onClick={() => void onToggleLike(comment.id)}
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
