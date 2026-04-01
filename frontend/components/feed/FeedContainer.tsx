"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

import FeedContent from "./FeedContent";
import FeedLoadingState from "./FeedLoadingState";

export default function FeedContainer() {
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

  if (!isReady || !isAuthenticated) {
    return <FeedLoadingState />;
  }

  return <FeedContent onUnauthorized={handleUnauthorized} user={user} />;
}
