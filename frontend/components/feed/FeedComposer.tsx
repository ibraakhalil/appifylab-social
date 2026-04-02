import { type ChangeEvent, type FormEvent, useRef } from "react";
import {
  CalendarDays,
  ChevronDown,
  CircleIcon,
  Globe,
  ImagePlus,
  Lock,
  SendHorizontalIcon,
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
  imageFile: File | null;
  imagePreviewUrl: string;
  visibility: "public" | "private";
};

type FeedComposerProps = {
  composer: FeedComposerState;
  currentUserFirstName: string;
  currentUserName: string;
  error: string | null;
  isSubmitting: boolean;
  onContentTextChange: (value: string) => void;
  onImageChange: (file: File | null) => void;
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
  onImageChange,
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

    onImageChange(file);
  };

  const visibilityLabel = composer.visibility === "public" ? "Public" : "Private";
  const VisibilityIcon = composer.visibility === "public" ? Globe : Lock;

  return (
    <section className="rounded-2xl bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5">
      <div className="flex items-start gap-3">
        <Avatar name={currentUserName} className="mt-1 size-11 text-sm max-sm:hidden" />
        <form className="flex-1 space-y-3" onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={composer.contentText}
              onChange={(event) => onContentTextChange(event.target.value)}
              className={cn(
                "bg-surface-muted text-ink focus:border-accent/50 min-h-28 w-full rounded-lg border border-transparent px-5 py-4 text-sm outline-none transition focus:bg-white",
                composer.imagePreviewUrl ? "pr-28" : undefined,
              )}
              placeholder={`What's on your mind, ${currentUserFirstName}?`}
            />
            {composer.imagePreviewUrl ? (
              <div className="absolute right-4 top-4 flex items-start gap-2 rounded-2xl border border-white/80 bg-white/95 p-2 shadow-[0_10px_30px_rgba(17,32,50,0.14)]">
                <Image
                  src={composer.imagePreviewUrl}
                  alt="Selected preview"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl object-cover"
                  unoptimized
                />
                <button
                  aria-label="Remove selected photo"
                  className="text-muted hover:bg-surface-muted hover:text-ink rounded-full p-1 transition"
                  type="button"
                  onClick={() => onImageChange(null)}
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

          <div className="mt-4 flex items-center justify-between gap-3 lg:flex-wrap">
            <div className="flex items-center gap-2">
              <button
                className="text-muted hover:text-ink flex items-center justify-center gap-2 rounded-2xl px-3 text-sm font-medium transition"
                type="button"
                onClick={handlePhotoButtonClick}
              >
                <ImagePlus className="text-success h-4 w-4" />
                <span className="max-md:hidden">Photo</span>
              </button>
              <button
                className="text-muted hover:text-ink flex items-center justify-center gap-2 rounded-2xl px-3 text-sm font-medium transition"
                type="button"
              >
                <Video className="text-accent h-4 w-4" />
                <span className="max-md:hidden">Live</span>
              </button>
              <button
                className="text-muted hover:text-ink flex items-center justify-center gap-2 rounded-2xl px-3 text-sm font-medium transition"
                type="button"
              >
                <CalendarDays className="h-4 w-4 text-[#fb8c00]" />
                <span className="max-md:hidden">Event</span>
              </button>
            </div>

            <div className="flex w-full items-center justify-end gap-4 sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="text-ink focus:border-accent/50 flex items-center justify-between gap-2 rounded-full bg-gray-100 px-2 py-0.5 text-[13px] outline-none transition"
                    type="button"
                  >
                    <VisibilityIcon className="text-muted size-3.5" />
                    <span>{visibilityLabel}</span>
                    <ChevronDown className="text-muted h-4 w-4" />
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
                        <Globe className="text-muted h-4 w-4" />
                        Public
                      </span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="private">
                      <span className="flex items-center gap-2">
                        <Lock className="text-muted h-4 w-4" />
                        Private
                      </span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <CircleIcon />
                ) : (
                  <SendHorizontalIcon className="text-accent size-5" />
                )}
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
