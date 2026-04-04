"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

import FeedContent from "./FeedContent";
import FeedSkeleton from "./FeedSkeleton";

export default function FeedContainer() {
  const router = useRouter();
  const { isAuthenticated, isReady, logout, user } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) {
    return <FeedSkeleton />;
  }

  return (
    <FeedContent
      onUnauthorized={() => {
        logout();
        router.replace("/login");
      }}
      user={user}
    />
  );
}
