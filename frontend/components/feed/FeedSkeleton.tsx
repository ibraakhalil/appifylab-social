import { cn } from "@/lib/utils";

type FeedSkeletonProps = {
  postCount?: number;
  showComposer?: boolean;
  showStories?: boolean;
};

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-surface-muted", className)} />;
}

function FeedComposerSkeleton() {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5">
      <div className="flex items-start gap-3">
        <SkeletonBlock className="mt-1 h-11 w-11 rounded-full" />
        <div className="flex-1 space-y-3">
          <SkeletonBlock className="min-h-28 rounded-lg" />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-12 w-24 rounded-2xl" />
              ))}
            </div>

            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <SkeletonBlock className="h-11 w-28 rounded-lg" />
              <SkeletonBlock className="h-11 w-20 rounded-lg bg-accent/15" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoriesSkeleton() {
  return (
    <section>
      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, index) => {
          const isAddCard = index === 0;

          return (
            <article
              key={index}
              className="relative h-[200px] w-[138px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="absolute inset-0 animate-pulse bg-surface-muted" />

              {isAddCard ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
                  <SkeletonBlock className="h-12 w-12 rounded-full bg-accent/15" />
                  <div className="w-full space-y-2">
                    <SkeletonBlock className="mx-auto h-4 w-24 rounded-full" />
                    <SkeletonBlock className="mx-auto h-3 w-20 rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col justify-between p-3">
                  <SkeletonBlock className="h-9 w-9 rounded-full border-2 border-white/70 bg-white/70" />
                  <div className="space-y-2">
                    <SkeletonBlock className="h-4 w-20 rounded-full bg-white/70" />
                    <SkeletonBlock className="h-4 w-16 rounded-full bg-white/55" />
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FeedPostSkeleton({
  hasImage = false,
  textLineWidths = ["w-11/12", "w-8/12"],
}: {
  hasImage?: boolean;
  textLineWidths?: string[];
}) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.08)] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonBlock className="h-11 w-11 rounded-full" />
          <div className="min-w-0 space-y-2">
            <SkeletonBlock className="h-4 w-32 rounded-full" />
            <SkeletonBlock className="h-3 w-28 rounded-full" />
          </div>
        </div>
        <SkeletonBlock className="h-10 w-10 rounded-full" />
      </div>

      <div className="mt-4 space-y-3">
        {textLineWidths.map((width) => (
          <SkeletonBlock key={width} className={cn("h-4 rounded-full", width)} />
        ))}
        {hasImage ? <SkeletonBlock className="h-72 rounded-lg border border-line/70" /> : null}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-b border-line/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-2">
          <SkeletonBlock className="h-8 w-8 rounded-full bg-accent/15" />
          <SkeletonBlock className="h-4 w-24 rounded-full" />
        </div>
        <SkeletonBlock className="h-4 w-24 rounded-full" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-12 rounded-2xl" />
        ))}
      </div>
    </article>
  );
}

export default function FeedSkeleton({
  postCount = 2,
  showComposer = true,
  showStories = true,
}: FeedSkeletonProps) {
  const shouldFillViewport = showComposer || showStories;

  return (
    <div
      className="space-y-6 pb-4"
      style={
        shouldFillViewport
          ? { minHeight: "calc(100vh - var(--header-height) - var(--layout-offset))" }
          : undefined
      }
    >
      {showComposer ? <FeedComposerSkeleton /> : null}
      {showStories ? <StoriesSkeleton /> : null}

      {Array.from({ length: postCount }).map((_, index) => (
        <FeedPostSkeleton
          key={index}
          hasImage={index % 2 === 0}
          textLineWidths={index % 2 === 0 ? ["w-full", "w-9/12"] : ["w-10/12", "w-7/12"]}
        />
      ))}
    </div>
  );
}
