import { type FormEvent } from "react";
import { CalendarDays, ImagePlus, Video } from "lucide-react";

import Avatar from "@/components/ui/Avatar";

export type FeedComposerState = {
  contentText: string;
  imageUrl: string;
  visibility: "public" | "private";
};

type FeedComposerProps = {
  composer: FeedComposerState;
  currentUserFirstName: string;
  currentUserName: string;
  error: string | null;
  isSubmitting: boolean;
  onContentTextChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  onVisibilityChange: (value: FeedComposerState["visibility"]) => void;
};

export default function FeedComposer({
  composer,
  currentUserFirstName,
  currentUserName,
  error,
  isSubmitting,
  onContentTextChange,
  onImageUrlChange,
  onSubmit,
  onVisibilityChange,
}: FeedComposerProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit();
  };

  return (
    <section className="rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5">
      <div className="flex items-start gap-3">
        <Avatar name={currentUserName} className="mt-1 size-11 text-sm" />
        <form className="flex-1 space-y-3" onSubmit={handleSubmit}>
          <textarea
            value={composer.contentText}
            onChange={(event) => onContentTextChange(event.target.value)}
            className="min-h-28 w-full rounded-[24px] border border-transparent bg-surface-muted px-5 py-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:bg-white"
            placeholder={`What's on your mind, ${currentUserFirstName}?`}
          />

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
            <input
              value={composer.imageUrl}
              onChange={(event) => onImageUrlChange(event.target.value)}
              className="h-12 rounded-full border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent/50"
              type="url"
              placeholder="Image URL (optional)"
            />
            <select
              value={composer.visibility}
              onChange={(event) => onVisibilityChange(event.target.value as FeedComposerState["visibility"])}
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
            <button
              className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink"
              type="button"
            >
              <Video className="h-4 w-4 text-accent" />
              Live
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink"
              type="button"
            >
              <ImagePlus className="h-4 w-4 text-success" />
              Photo
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink"
              type="button"
            >
              <CalendarDays className="h-4 w-4 text-[#fb8c00]" />
              Event
            </button>
            <button
              className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-accent/60"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
