"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api/client";
import { createPost } from "@/lib/api/posts";

import FeedComposer, { type FeedComposerState } from "./FeedComposer";

const initialComposerState: FeedComposerState = {
  contentText: "",
  imageFile: null,
  imagePreviewUrl: "",
  visibility: "public",
};

const revokePreviewUrl = (previewUrl: string) => {
  if (previewUrl.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl);
  }
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

  useEffect(
    () => () => {
      revokePreviewUrl(composer.imagePreviewUrl);
    },
    [composer.imagePreviewUrl],
  );

  const updateComposer = (updater: (current: FeedComposerState) => FeedComposerState) => {
    setComposer((current) => updater(current));
    setError(null);
  };

  const handleImageChange = (file: File | null) => {
    setComposer((current) => ({
      ...current,
      imageFile: file,
      imagePreviewUrl: file ? URL.createObjectURL(file) : "",
    }));
    setError(null);
  };

  const handleCreatePost = async () => {
    if (!composer.contentText.trim() && !composer.imageFile) {
      setError("Write something or choose a photo before posting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (composer.contentText.trim()) {
        formData.set("contentText", composer.contentText.trim());
      }

      if (composer.imageFile) {
        formData.set("image", composer.imageFile);
      }

      formData.set("visibility", composer.visibility);

      await createPost({ formData });

      setComposer({ ...initialComposerState });
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
      onImageChange={handleImageChange}
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
