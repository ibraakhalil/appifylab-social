import { type ChangeEvent, type FormEvent, useRef } from "react";
import {
  CalendarDays,
  ChevronDown,
  Globe,
  ImagePlus,
  Lock,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";

import Avatar from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit();
  };

  const handlePhotoButtonClick = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onImageUrlChange(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const visibilityLabel = composer.visibility === "public" ? "Public" : "Private";
  const VisibilityIcon = composer.visibility === "public" ? Globe : Lock;

  return (
    <section className="rounded-2xl bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5">
      <div className="flex items-start gap-3">
        <Avatar name={currentUserName} className="mt-1 size-11 text-sm" />
        <form className="flex-1 space-y-3" onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={composer.contentText}
              onChange={(event) => onContentTextChange(event.target.value)}
              className={cn(
                "min-h-28 w-full rounded-lg border border-transparent bg-surface-muted px-5 py-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:bg-white",
                composer.imageUrl ? "pr-28" : undefined,
              )}
              placeholder={`What's on your mind, ${currentUserFirstName}?`}
            />
            {composer.imageUrl ? (
              <div className="absolute right-4 top-4 flex items-start gap-2 rounded-2xl border border-white/80 bg-white/95 p-2 shadow-[0_10px_30px_rgba(17,32,50,0.14)]">
                <Image
                  src={composer.imageUrl}
                  alt="Selected preview"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl object-cover"
                  unoptimized
                />
                <button
                  aria-label="Remove selected photo"
                  className="rounded-full p-1 text-muted transition hover:bg-surface-muted hover:text-ink"
                  type="button"
                  onClick={() => onImageUrlChange("")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
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
                onClick={handlePhotoButtonClick}
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
            </div>

            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex h-11 items-center justify-between gap-2 rounded-lg  bg-gray-100 px-4 text-sm text-ink outline-none transition hover:border-accent/50 focus:border-accent/50"
                    type="button"
                  >
                    <VisibilityIcon className="h-4 w-4 text-muted" />
                    <span>{visibilityLabel}</span>
                    <ChevronDown className="h-4 w-4 text-muted" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuRadioGroup
                    value={composer.visibility}
                    onValueChange={(value) =>
                      onVisibilityChange(value as FeedComposerState["visibility"])
                    }
                  >
                    <DropdownMenuRadioItem value="public">
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted" />
                        Public
                      </span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="private">
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted" />
                        Private
                      </span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                className="rounded-lg h-11 cursor-pointer bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-accent/60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
          <input
            ref={photoInputRef}
            accept="image/*"
            className="hidden"
            type="file"
            onChange={handlePhotoChange}
          />
        </form>
      </div>
    </section>
  );
}
