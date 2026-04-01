import Image from "next/image";
import Link from "next/link";
import { suggestedPeople, events } from "@/app/data/mock";
import {
  Bookmark,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";

const exploreItems = [
  { label: "Learning", icon: GraduationCap, badge: "New" },
  { label: "Insights", icon: Lightbulb },
  { label: "Find friends", icon: Users },
  { label: "Bookmarks", icon: Bookmark },
  { label: "Gaming", icon: Gamepad2, badge: "New" },
  { label: "Settings", icon: Settings },
];

export default function LeftSidebar() {
  return (
    <aside className="hide-scrollbar sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="space-y-5">
        <section className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_45px_rgba(17,32,50,0.08)]">
          <h2 className="mb-5 text-lg font-semibold text-ink">Explore</h2>
          <ul className="space-y-3">
            {exploreItems.map(({ label, icon: Icon, badge }) => (
              <li key={label}>
                <Link
                  href="#"
                  className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    {label}
                  </span>
                  {badge ? (
                    <span className="rounded-full border border-white bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_45px_rgba(17,32,50,0.08)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Suggested People</h2>
            <Link className="text-xs font-semibold uppercase tracking-[0.16em] text-accent" href="#">
              See all
            </Link>
          </div>
          {suggestedPeople.map((person) => (
            <div key={person.id} className="mb-4 rounded-3xl bg-surface-muted p-4 last:mb-0">
              <div className="flex items-start gap-3">
                <Link href="#" className="shrink-0">
                  <Image
                    src={person.image}
                    width={44}
                    height={44}
                    alt={person.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href="#" className="block text-sm font-semibold text-ink">
                    {person.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted">{person.role}</p>
                </div>
              </div>
              <Link
                href="#"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-muted transition hover:border-accent/40 hover:text-accent"
              >
                <UserPlus className="h-4 w-4" />
                Connect
              </Link>
            </div>
          ))}
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_45px_rgba(17,32,50,0.08)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Events</h2>
            <Link href="#" className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              See all
            </Link>
          </div>
          {events.map((evt) => (
            <Link key={evt.id} className="mb-4 block overflow-hidden rounded-3xl border border-line bg-surface-muted last:mb-0" href="#">
              <Image
                src={evt.image}
                width={320}
                height={160}
                alt={evt.title}
                className="h-32 w-full object-cover"
              />
              <div className="space-y-4 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex w-[60px] shrink-0 flex-col items-center rounded-2xl bg-white px-2 py-2 text-center shadow-sm">
                    <span className="text-lg font-semibold leading-none text-ink">{evt.date.split(" ")[0]}</span>
                    <span className="mt-1 text-sm font-medium uppercase tracking-[0.12em] text-muted">
                      {evt.date.split(" ")[1]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-6 text-ink">{evt.title}</h3>
                    <p className="mt-1 text-xs text-muted">{evt.going} people going</p>
                  </div>
                </div>
                <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  Going
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </aside>
  );
}
