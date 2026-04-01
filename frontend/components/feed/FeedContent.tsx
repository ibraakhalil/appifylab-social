"use client";

import { useState } from "react";

import type { SessionUser } from "@/lib/auth/session";

import FeedComposerSection from "./FeedComposerSection";
import FeedTimeline from "./FeedTimeline";
import StoriesSection from "./StoriesSection";

type FeedContentProps = {
  onUnauthorized: () => void;
  user: SessionUser | null;
};

export default function FeedContent({ onUnauthorized, user }: FeedContentProps) {
  const [refreshKey, setRefreshKey] = useState(0);

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
        onPostCreated={() => setRefreshKey((current) => current + 1)}
        onUnauthorized={onUnauthorized}
      />

      <StoriesSection />

      <FeedTimeline
        currentUserName={currentUserName}
        onUnauthorized={onUnauthorized}
        refreshKey={refreshKey}
      />
    </div>
  );
}
