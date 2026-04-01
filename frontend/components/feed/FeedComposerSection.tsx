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

  const updateComposer = (updater: (current: FeedComposerState) => FeedComposerState) => {
    setComposer((current) => updater(current));
    setError(null);
  };

  const handleCreatePost = async () => {
    if (!composer.contentText.trim() && !composer.imageUrl.trim()) {
      setError("Write something or choose a photo before posting.");
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
        updateComposer((current) => ({
          ...current,
          contentText: value,
        }))
      }
      onImageUrlChange={(value) =>
        updateComposer((current) => ({
          ...current,
          imageUrl: value,
        }))
      }
      onSubmit={handleCreatePost}
      onVisibilityChange={(value) =>
        updateComposer((current) => ({
          ...current,
          visibility: value,
        }))
      }
    />
  );
}
