"use client";

import { useState } from "react";

import { ApiError } from "@/lib/api/client";
import { createPost } from "@/lib/api/posts";

import FeedComposer, { type FeedComposerState } from "./FeedComposer";

const initialComposerState: FeedComposerState = {
  contentText: "",
  imageUrl: "",
  visibility: "public",
};

type FeedComposerSectionProps = {
  currentUserFirstName: string;
  currentUserName: string;
  onPostCreated: () => void;
  onUnauthorized: () => void;
};

export default function FeedComposerSection({
  currentUserFirstName,
  currentUserName,
  onPostCreated,
  onUnauthorized,
}: FeedComposerSectionProps) {
  const [composer, setComposer] = useState<FeedComposerState>(initialComposerState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async () => {
    if (!composer.contentText.trim() && !composer.imageUrl.trim()) {
      setError("Write something or add an image URL before posting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPost({
        contentText: composer.contentText.trim() || undefined,
        imageUrl: composer.imageUrl.trim() || undefined,
        visibility: composer.visibility,
      });

      setComposer(initialComposerState);
      setError(null);
      onPostCreated();
    } catch (submissionError) {
      if (submissionError instanceof ApiError && submissionError.status === 401) {
        onUnauthorized();
        return;
      }

      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to create post.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FeedComposer
      composer={composer}
      currentUserFirstName={currentUserFirstName}
      currentUserName={currentUserName}
      error={error}
      isSubmitting={isSubmitting}
      onContentTextChange={(value) =>
        setComposer((current) => ({
          ...current,
          contentText: value,
        }))
      }
      onImageUrlChange={(value) =>
        setComposer((current) => ({
          ...current,
          imageUrl: value,
        }))
      }
      onSubmit={handleCreatePost}
      onVisibilityChange={(value) =>
        setComposer((current) => ({
          ...current,
          visibility: value,
        }))
      }
    />
  );
}
