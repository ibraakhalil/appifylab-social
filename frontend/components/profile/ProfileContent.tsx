"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { CalendarDays, Mail } from "lucide-react";

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

const formatCountLabel = (value: number, singular: string, plural = `${singular}s`) =>
  `${value} ${value === 1 ? singular : plural}`;

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
  const profileLabel = profile.isCurrentUser ? "Your profile" : "Profile";
  const stats = [
    {
      label: "Posts",
      value: formatCountLabel(profile.stats.postCount, "post"),
      hint: profile.viewerCanSeePrivatePosts
        ? `${formatCountLabel(profile.stats.publicPostCount, "public post")}, ${formatCountLabel(profile.stats.privatePostCount, "private post")}`
        : "Visible on this profile",
    },
    {
      label: "Replies and comments",
      value: formatCountLabel(profile.stats.totalCommentCount, "response"),
      hint: profile.isCurrentUser ? "Across all of your posts" : "Across visible posts",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {error}
        </div>
      ) : null}

      <section className="border-line/70 rounded-3xl border bg-white px-5 py-6 shadow-[0_16px_40px_rgba(17,32,50,0.06)] sm:px-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar name={currentUserName} className="h-16 w-16 shrink-0 text-xl" />
              <div className="min-w-0">
                <p className="text-subtle text-xs font-medium uppercase tracking-[0.16em]">
                  {profileLabel}
                </p>
                <h1 className="text-ink mt-1 text-2xl font-semibold">
                  {profile.user.firstName} {profile.user.lastName}
                </h1>
                <div className="text-muted mt-3 space-y-2 text-sm">
                  {profile.isCurrentUser ? (
                    <p className="flex items-center gap-2 break-all">
                      <Mail className="text-subtle h-4 w-4 shrink-0" />
                      <span>{profile.user.email}</span>
                    </p>
                  ) : null}
                  <p className="flex items-center gap-2">
                    <CalendarDays className="text-subtle h-4 w-4 shrink-0" />
                    <span>Member since {formatMemberSince(profile.user.createdAt)}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-line bg-surface-muted text-muted inline-flex items-center rounded-full border px-3 py-1.5 text-sm">
              {profile.isCurrentUser
                ? `Signed in as ${sessionUser?.email ?? profile.user.email}`
                : "Public posts only"}
            </div>
          </div>

          <dl className="border-line/70 grid gap-4 border-t pt-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <dt className="text-muted text-sm font-medium">{stat.label}</dt>
                <dd className="text-ink text-lg font-semibold">{stat.value}</dd>
                <p className="text-subtle text-sm">{stat.hint}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="space-y-4">
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
