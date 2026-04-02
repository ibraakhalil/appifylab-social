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
        <Avatar name={currentUserName} className="mt-1 max-sm:hidden size-11 text-sm" />
        <form className="flex-1 space-y-3" onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={composer.contentText}
              onChange={(event) => onContentTextChange(event.target.value)}
              className={cn(
                "min-h-28 w-full rounded-lg border border-transparent bg-surface-muted px-5 py-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:bg-white",
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
                  className="rounded-full p-1 text-muted transition hover:bg-surface-muted hover:text-ink"
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

          <div className="mt-4 flex items-center lg:flex-wrap justify-between gap-3">
            <div className="flex items-center gap-2">
             <button
                className="flex items-center justify-center gap-2 rounded-2xl px-3  text-sm font-medium text-muted transition  hover:text-ink"
                type="button"
                onClick={handlePhotoButtonClick}
              >
                <ImagePlus className="h-4 w-4 text-success" />
                <span className="max-md:hidden">Photo</span>
              </button>
              <button
                className="flex items-center justify-center gap-2 rounded-2xl px-3  text-sm font-medium text-muted transition  hover:text-ink"
                type="button"
              >
                <Video className="h-4 w-4 text-accent" />
               <span className="max-md:hidden">Live</span>
              </button>
              <button
                className="flex items-center justify-center gap-2 rounded-2xl px-3  text-sm font-medium text-muted transition  hover:text-ink"
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
                    className="flex items-center justify-between gap-2  bg-gray-100 py-0.5 rounded-full  px-2 text-[13px] text-ink outline-none transition  focus:border-accent/50"
                    type="button"
                  >
                    <VisibilityIcon className="size-3.5 text-muted" />
                    <span >{visibilityLabel}</span>
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
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircleIcon/> : <SendHorizontalIcon className="text-accent size-5"/>}
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
