import Link from "next/link";
import Image from "next/image";
import { Bell, Search } from "lucide-react";

export default function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <Image src="/images/logo.svg" alt="Logo" width={118} height={28} className="h-7 w-auto" priority />
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-muted transition hover:bg-accent/10 hover:text-accent"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-muted transition hover:bg-accent/10 hover:text-accent"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
              6
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
