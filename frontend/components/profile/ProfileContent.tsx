"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { CalendarDays, EyeOff, FileText, Globe2, Mail, MessageCircleMore } from "lucide-react";

import FeedLoadingState from "@/components/feed/FeedLoadingState";
import FeedTimeline from "@/components/feed/FeedTimeline";
import Avatar from "@/components/ui/Avatar";
import { ApiError } from "@/lib/api/client";
import type { FeedResponse, ProfileResponse } from "@/lib/api/types";
import type { SessionUser } from "@/lib/auth/session";

type ProfileContentProps = {
  emptyStateMessage: string;
  loadPosts: (cursor?: string | null) => Promise<FeedResponse>;
  loadProfile: () => Promise<ProfileResponse>;
  onUnauthorized: () => void;
  sessionUser: SessionUser | null;
};

const formatMemberSince = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const statCards = (
  stats: ProfileResponse["stats"],
) => [
  {
    icon: FileText,
    label: "Posts",
    value: stats.postCount,
  },
  {
    icon: Globe2,
    label: "Public posts",
    value: stats.publicPostCount,
  },
  {
    icon: EyeOff,
    label: "Private posts",
    value: stats.privatePostCount,
  },
  {
    icon: MessageCircleMore,
    label: "Comments",
    value: stats.totalCommentCount,
  },
];

export default function ProfileContent({
  emptyStateMessage,
  loadPosts,
  loadProfile,
  onUnauthorized,
  sessionUser,
}: ProfileContentProps) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfileData = useCallback(async () => {
    try {
      const response = await loadProfile();
      setProfile(response);
      setError(null);
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 401) {
        onUnauthorized();
        return;
      }

      setError(loadError instanceof Error ? loadError.message : "Unable to load profile.");
    }
  }, [loadProfile, onUnauthorized]);

  useEffect(() => {
    startTransition(() => {
      void loadProfileData();
    });
  }, [loadProfileData]);

  if (!profile && !error) {
    return <FeedLoadingState />;
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        {error ?? "Unable to load profile."}
      </div>
    );
  }

  const currentUserName = `${profile.user.firstName} ${profile.user.lastName}`;
  const visibleStatCards = statCards(profile.stats).filter(
    (card) =>
      profile.viewerCanSeePrivatePosts ||
      (card.label !== "Private posts" && card.label !== "Public posts"),
  );
  const profileLabel = profile.isCurrentUser ? "Personal profile" : "Public profile";
  const profileTitle = profile.isCurrentUser ? "Your posts" : `${profile.user.firstName}'s posts`;
  const profileDescription = profile.isCurrentUser
    ? "Review everything you have shared on Buddy Script."
    : `Browse what ${profile.user.firstName} has shared publicly on Buddy Script.`;

  return (
    <div className="space-y-6 pb-8">
      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_60px_rgba(17,32,50,0.08)]">
        <div className="bg-[linear-gradient(135deg,#112032_0%,#0f6edc_55%,#7ec8ff_100%)] px-6 py-10 text-white sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <Avatar name={currentUserName} className="h-20 w-20 shrink-0 border-4 border-white/20 text-2xl" />
              <div className="min-w-0">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
                  {profileLabel}
                </p>
                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  {profile.user.firstName} {profile.user.lastName}
                </h1>
                <div className="mt-3 flex flex-col gap-2 text-sm text-white/85 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {profile.user.email}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Member since {formatMemberSince(profile.user.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/85 backdrop-blur">
              {profile.isCurrentUser
                ? `Signed in as ${sessionUser?.email ?? profile.user.email}`
                : "Only public posts are visible here"}
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4 sm:px-8">
          {visibleStatCards.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-line/70 bg-surface-muted px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-muted">{label}</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold text-ink">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-ink">{profileTitle}</h2>
            <p className="text-sm text-muted">{profileDescription}</p>
          </div>
        </div>

        <FeedTimeline
          currentUserName={currentUserName}
          emptyStateMessage={emptyStateMessage}
          loadMoreLabel={profile.isCurrentUser ? "Load more of your posts" : "Load more posts"}
          loadPosts={loadPosts}
          onUnauthorized={onUnauthorized}
          refreshKey={0}
        />
      </section>
    </div>
  );
}
