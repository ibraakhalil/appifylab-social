"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import {
  getMyProfile,
  getMyProfilePosts,
  getUserProfile,
  getUserProfilePosts,
} from "@/lib/api/profile";

import FeedLoadingState from "@/components/feed/FeedLoadingState";

import ProfileContent from "./ProfileContent";

type ProfileContainerProps = {
  userId?: string;
};

export default function ProfileContainer({ userId }: ProfileContainerProps) {
  const router = useRouter();
  const { isAuthenticated, isReady, logout, user } = useAuth();

  const handleUnauthorized = useCallback(() => {
    logout();
    router.replace("/login");
  }, [logout, router]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isReady, router]);

  const loadProfile = useCallback(
    () => (userId ? getUserProfile(userId) : getMyProfile()),
    [userId],
  );
  const loadPosts = useCallback(
    (cursor?: string | null) =>
      userId ? getUserProfilePosts(userId, cursor) : getMyProfilePosts(cursor),
    [userId],
  );

  if (!isReady || !isAuthenticated) {
    return <FeedLoadingState />;
  }

  return (
    <ProfileContent
      emptyStateMessage={
        userId ? "No public posts to show yet." : "You have not published any posts yet."
      }
      loadPosts={loadPosts}
      loadProfile={loadProfile}
      onUnauthorized={handleUnauthorized}
      sessionUser={user}
    />
  );
}
