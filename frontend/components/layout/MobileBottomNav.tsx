"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, House, UserRound, UsersRound } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="border-line/70 bg-header/95 fixed inset-x-0 bottom-0 z-50 border-t px-4 py-3 backdrop-blur lg:hidden">
      <div className="bg-nav-shell text-nav-ink mx-auto flex max-w-md items-center justify-between rounded-full px-4 py-2 shadow-[var(--shadow-nav)]">
        <Link
          className={`flex min-w-16 flex-col items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition ${
            pathname === "/" ? "text-nav-ink" : "text-nav-ink-muted hover:text-nav-ink"
          }`}
          href="/"
        >
          <House className="h-5 w-5" />
          Home
        </Link>
        <Link
          className="text-nav-ink-muted hover:text-nav-ink flex min-w-16 flex-col items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition"
          href="#"
        >
          <UsersRound className="h-5 w-5" />
          People
        </Link>
        <button
          className="text-nav-ink-muted hover:text-nav-ink relative flex min-w-16 flex-col items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition"
          type="button"
        >
          <Bell className="h-5 w-5" />
          Alerts
          <span className="bg-accent text-contrast absolute right-3 top-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold">
            6
          </span>
        </button>
        <Link
          className={`flex min-w-16 flex-col items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition ${
            pathname === "/profile"
              ? "text-nav-ink"
              : "text-nav-ink-muted hover:text-nav-ink"
          }`}
          href="/profile"
        >
          {user ? (
            <Avatar
              name={`${user.firstName} ${user.lastName}`}
              className="h-8 w-8 border border-nav-ink/20 text-[10px]"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-nav-ink/20">
              <UserRound className="h-4 w-4" />
            </span>
          )}
          Profile
        </Link>
      </div>
    </div>
  );
}
