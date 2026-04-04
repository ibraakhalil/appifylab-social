"use client";

import { getFeed } from "@/lib/api/posts";
import type { SessionUser } from "@/lib/auth/session";
import { feedKeys } from "@/lib/query/keys";

import FeedComposerSection from "./FeedComposerSection";
import FeedTimeline from "./FeedTimeline";
import StoriesSection from "./StoriesSection";

type FeedContentProps = {
  onUnauthorized: () => void;
  user: SessionUser | null;
};

export default function FeedContent({ onUnauthorized, user }: FeedContentProps) {
  const currentUserId = user?.id;
  const currentUserName = user ? `${user.firstName} ${user.lastName}` : "User";
  const currentUserFirstName = user?.firstName ?? "there";

  return (
    <div
      className="space-y-6 pb-4"
      style={{ minHeight: "calc(100vh - var(--header-height) - var(--layout-offset))" }}
    >
      <FeedComposerSection
        currentUserFirstName={currentUserFirstName}
        currentUserName={currentUserName}
        onUnauthorized={onUnauthorized}
      />

      <StoriesSection />

      <FeedTimeline
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        loadPosts={getFeed}
        onUnauthorized={onUnauthorized}
        queryKey={feedKeys.home()}
      />
    </div>
  );
}
