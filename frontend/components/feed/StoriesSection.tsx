import { Plus } from "lucide-react";

import { stories } from "@/app/data/mock";
import Avatar from "@/components/ui/Avatar";

export default function StoriesSection() {
  return (
    <section className="">

      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2">
        {stories.map((story) => (
          <article
            key={story.id}
            className="relative h-[214px] w-[146px] shrink-0 overflow-hidden rounded-2xl bg-ink"
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#0f172a] via-[#1d4ed8] to-[#60a5fa]" />
            <div className="absolute inset-0 bg-linear-to-t from-[#112032] via-[#112032]/50 to-transparent" />
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
                  <Avatar name={story.name} className="h-8 w-8 text-[10px]" />
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
  );
}
