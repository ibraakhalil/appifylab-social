import Image from "next/image";
import Link from "next/link";
import { friends } from "@/app/data/mock";
import { MessageCircleMore, Search } from "lucide-react";

export default function RightSidebar() {
  return (
    <aside className="hide-scrollbar sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="space-y-5">
        <section className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_45px_rgba(17,32,50,0.08)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Friends</h2>
            <Link className="text-xs font-semibold uppercase tracking-[0.16em] text-accent" href="#">
              See all
            </Link>
          </div>
          <ul className="space-y-4">
            {friends.slice(0, 4).map((friend) => (
              <li key={friend.id}>
                <Link
                  className="flex items-center gap-3 rounded-3xl bg-surface-muted px-4 py-3 transition hover:bg-accent/5"
                  href="#"
                >
                  <Image
                    src={friend.image}
                    width={44}
                    height={44}
                    alt={friend.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-ink">{friend.name}</h3>
                    <p className="mt-1 text-xs text-muted">{friend.time ?? friend.role}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_45px_rgba(17,32,50,0.08)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Online Friends</h2>
            <Link className="text-xs font-semibold uppercase tracking-[0.16em] text-accent" href="#">
              See all
            </Link>
          </div>

          <form className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              type="text"
              className="h-11 w-full rounded-full border border-transparent bg-surface-muted pl-11 pr-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:bg-white"
              placeholder="Search friends"
            />
          </form>

          <ul className="space-y-4">
            {friends
              .filter((friend) => friend.active)
              .map((friend) => (
                <li key={friend.id} className="flex items-center gap-3 rounded-3xl bg-surface-muted px-4 py-3">
                  <Link className="flex min-w-0 flex-1 items-center gap-3" href="#">
                    <div className="relative">
                      <Image
                        src={friend.image}
                        width={44}
                        height={44}
                        alt={friend.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-success" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-ink">{friend.name}</h3>
                      <p className="mt-1 text-xs text-muted">{friend.role}</p>
                    </div>
                  </Link>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-muted transition hover:bg-accent/10 hover:text-accent"
                    type="button"
                    aria-label={`Message ${friend.name}`}
                  >
                    <MessageCircleMore className="h-4 w-4" />
                  </button>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
