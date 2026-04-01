import Link from "next/link";
import Image from "next/image";
import { Bell, House, UsersRound } from "lucide-react";

export default function MobileBottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line/70 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-full bg-ink px-4 py-2 text-white shadow-[0_-12px_35px_rgba(17,32,50,0.18)]">
        <Link
          className="flex min-w-16 flex-col items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-white"
          href="/"
        >
          <House className="h-5 w-5" />
          Home
        </Link>
        <Link
          className="flex min-w-16 flex-col items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-white/70 transition hover:text-white"
          href="#"
        >
          <UsersRound className="h-5 w-5" />
          People
        </Link>
        <button
          className="relative flex min-w-16 flex-col items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-white/70 transition hover:text-white"
          type="button"
        >
          <Bell className="h-5 w-5" />
          Alerts
          <span className="absolute right-3 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
            6
          </span>
        </button>
        <button
          className="flex min-w-16 flex-col items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-white/70 transition hover:text-white"
          type="button"
        >
          <Image
            src="/images/profile.png"
            width={32}
            height={32}
            alt="Profile"
            className="h-8 w-8 rounded-full border border-white/20 object-cover"
          />
          Profile
        </button>
      </div>
    </div>
  );
}
