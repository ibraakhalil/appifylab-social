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
    <aside
      className="hide-scrollbar sticky overflow-y-auto pb-4"
      style={{
        top: "calc(var(--header-height) + var(--layout-offset))",
        maxHeight: "calc(100vh - var(--header-height) - var(--layout-offset))",
      }}
    >
      <div className="space-y-4">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-ink">Explore</h2>
          <ul className="space-y-2">
            {exploreItems.map(({ label, icon: Icon, badge }) => (
              <li key={label}>
                <Link
                  href="#"
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-muted text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    {label}
                  </span>
                  {badge ? (
                    <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-ink">Suggested People</h2>
            <Link className="text-xs font-semibold text-accent" href="#">
              See all
            </Link>
          </div>
          <ul className="space-y-3">
            {suggestedPeople.map((person) => (
              <li key={person.id}>
                <div className="flex items-center gap-3 rounded-xl border border-line px-3 py-3">
                  <Link href="#" className="shrink-0">
                    <Image
                      src={person.image}
                      width={40}
                      height={40}
                      alt={person.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href="#" className="block text-sm font-semibold text-ink">
                      {person.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">{person.role}</p>
                  </div>
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center rounded-lg border border-line px-3 py-2 text-xs font-medium text-muted transition hover:border-accent/40 hover:text-accent"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-ink">Events</h2>
            <Link href="#" className="text-xs font-semibold text-accent">
              See all
            </Link>
          </div>
          <ul className="space-y-3">
            {events.map((evt) => (
              <li key={evt.id}>
                <Link
                  className="flex items-start gap-3 rounded-xl border border-line px-3 py-3 transition hover:bg-surface-muted"
                  href="#"
                >
                  <div className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-surface-muted px-2 py-2 text-center">
                    <span className="text-base font-semibold leading-none text-ink">{evt.date.split(" ")[0]}</span>
                    <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                      {evt.date.split(" ")[1]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold leading-5 text-ink">{evt.title}</h3>
                    <p className="mt-1 text-xs text-muted">{evt.going} people going</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
