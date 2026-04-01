import Image from "next/image";
import Link from "next/link";
import { posts, stories } from "@/app/data/mock";
import {
  CalendarDays,
  Globe2,
  ImagePlus,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  ThumbsUp,
  Video,
} from "lucide-react";

export default function FeedContainer() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5">
        <div className="flex items-center gap-3">
          <Link href="#" className="shrink-0">
            <Image
              src="/images/profile.png"
              width={44}
              height={44}
              alt="Profile"
              className="h-11 w-11 rounded-full object-cover"
            />
          </Link>
          <form className="flex-1">
            <input
              className="h-12 w-full rounded-full border border-transparent bg-surface-muted px-5 text-sm text-ink outline-none transition focus:border-accent/50 focus:bg-white"
              type="text"
              placeholder="What’s on your mind, Dylan?"
            />
          </form>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line/70 pt-4">
          <button className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink" type="button">
            <Video className="h-4 w-4 text-accent" />
            Live
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink" type="button">
            <ImagePlus className="h-4 w-4 text-success" />
            Photo
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink" type="button">
            <CalendarDays className="h-4 w-4 text-[#fb8c00]" />
            Event
          </button>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink">Stories</h2>
          <p className="mt-1 text-sm text-muted">Quick updates from your network</p>
        </div>
        <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2">
          {stories.map((story) => (
            <article
              key={story.id}
              className="relative h-[214px] w-[146px] shrink-0 overflow-hidden rounded-[26px] bg-ink"
            >
              <Image
                src={story.image}
                width={146}
                height={214}
                alt={story.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#112032] via-[#112032]/50 to-transparent" />
              {story.isAdd ? (
                <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-between p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-white shadow-lg">
                    <Plus className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-5 text-white">Create Story</p>
                    <p className="mt-1 text-xs text-white/70">Share a new update</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-between p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-white bg-white/15 backdrop-blur">
                    <Image
                      src={story.mini ?? "/images/profile.png"}
                      width={32}
                      height={32}
                      alt={story.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-5 text-white">{story.name}</p>
                    <p className="mt-1 text-xs text-white/70">Tap to view story</p>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <div>
        <h2 className="text-lg font-semibold text-ink">Top Posts</h2>
        <p className="mt-1 text-sm text-muted">Fresh conversations from the community</p>
      </div>

      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="#" className="shrink-0">
                <Image
                  src={post.authorImage}
                  width={44}
                  height={44}
                  alt={post.author}
                  className="h-11 w-11 rounded-full object-cover"
                />
              </Link>
              <div className="min-w-0">
                <Link href="#" className="block text-sm font-semibold text-ink">
                  {post.author}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <span>{post.time}</span>
                  <span className="h-1 w-1 rounded-full bg-subtle" />
                  <span className="inline-flex items-center gap-1">
                    <Globe2 className="h-3.5 w-3.5" />
                    {post.visibility}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-muted transition hover:bg-accent/10 hover:text-accent"
              type="button"
              aria-label="More post options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm leading-7 text-muted">{post.postText}</p>
            <div className="mt-4 overflow-hidden rounded-[24px]">
              <Image
                src={post.postImage}
                width={960}
                height={640}
                alt="Post"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-b border-line/70 pb-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                <ThumbsUp className="h-4 w-4" />
              </span>
              <span className="font-medium text-ink">{post.reactions} reactions</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{post.commentsCount} comments</span>
              <span>{post.sharesCount} shares</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink" type="button">
              <ThumbsUp className="h-4 w-4" />
              Like
            </button>
            <button className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink" type="button">
              <MessageCircle className="h-4 w-4" />
              Comment
            </button>
            <button className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink" type="button">
              <Send className="h-4 w-4" />
              Share
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
