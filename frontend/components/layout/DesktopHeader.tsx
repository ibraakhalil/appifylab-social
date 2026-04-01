import Link from "next/link";
import Image from "next/image";
import { Bell, ChevronDown, House, Search, UsersRound } from "lucide-react";

export default function DesktopHeader() {
  return (
    <header className="sticky top-0 z-50 hidden border-b border-line/70 bg-white/90 backdrop-blur lg:block">
      <div className="mx-auto flex max-w-[1440px] items-center gap-5 px-6 py-4 xl:px-8">
        <Link href="/" className="shrink-0">
          <Image src="/images/logo.svg" alt="Logo" width={118} height={28} className="h-7 w-auto" priority />
        </Link>

        <form className="relative hidden max-w-md flex-1 lg:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            className="h-11 w-full rounded-full border border-transparent bg-surface-muted pl-11 pr-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:bg-white"
            type="search"
            placeholder="Search people, groups, and posts"
            aria-label="Search"
          />
        </form>

        <nav className="ml-auto flex items-center gap-2">
          <Link
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent transition hover:bg-accent hover:text-white"
            href="/"
            aria-label="Home"
          >
            <House className="h-5 w-5" />
          </Link>
          <Link
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-muted transition hover:bg-surface-muted hover:text-accent"
            href="#"
            aria-label="Friend requests"
          >
            <UsersRound className="h-5 w-5" />
          </Link>
          <button
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl text-muted transition hover:bg-surface-muted hover:text-accent"
            type="button"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
              6
            </span>
          </button>
        </nav>

        <button
          className="flex items-center gap-3 rounded-full border border-line bg-white px-2.5 py-1.5 shadow-sm transition hover:border-accent/40 hover:shadow-[0_12px_30px_rgba(17,32,50,0.08)]"
          type="button"
        >
          <Image
            src="/images/profile.png"
            width={40}
            height={40}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="hidden text-left xl:block">
            <p className="text-sm font-semibold text-ink">Dylan Field</p>
            <p className="text-xs text-muted">Community profile</p>
          </div>
          <ChevronDown className="h-4 w-4 text-subtle" />
        </button>
      </div>
    </header>
  );
}
