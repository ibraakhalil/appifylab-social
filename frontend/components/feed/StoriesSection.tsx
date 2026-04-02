import Image from "next/image";
import { Plus } from "lucide-react";

import { stories } from "@/app/data/mock";
import Avatar from "@/components/ui/Avatar";

export default function StoriesSection() {
  const storyImages = [
    "/stories/story-1.png",
    "/stories/story-2.png",
    "/stories/story-3.png",
    "/stories/story-4.png",
    "/stories/story-5.png",
  ];
  const storyNames = ["Aariz Rahman", "Nusrat Jahan", "Tanvir Hasan", "Mim Akter", "Sajid Hossain"];

  return (
    <section className="">
      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2">
        {stories.map((story) => (
          <article
            key={story.id}
            className="relative h-[200px] w-[138px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            {!story.isAdd ? (
              <Image
                src={storyImages[(story.id - 2) % storyImages.length] ?? storyImages[0]}
                alt={story.name}
                fill
                className="object-cover"
                sizes="146px"
              />
            ) : null}
            <div
              className={`absolute inset-0 ${
                story.isAdd
                  ? "bg-surface-muted"
                  : "bg-linear-to-t from-black/55 via-black/10 to-transparent"
              }`}
            />
            {story.isAdd ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 text-center">
                <span className="bg-accent flex h-12 w-12 items-center justify-center rounded-full text-white">
                  <Plus className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-ink text-sm font-semibold">Create story</p>
                  <p className="text-muted mt-1 text-xs">Share a quick update</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col justify-between p-3">
                <div>
                  <Avatar
                    name={storyNames[(story.id - 2) % storyNames.length] ?? story.name}
                    className="h-9 w-9 border-2 border-white text-[10px]"
                  />
                </div>
                <div>
                  <p className="line-clamp-2 text-sm font-semibold leading-5 text-white">
                    {storyNames[(story.id - 2) % storyNames.length] ?? story.name}
                  </p>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
