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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line/70 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-full bg-ink px-4 py-2 text-white shadow-[0_-12px_35px_rgba(17,32,50,0.18)]">
        <Link
          className={`flex min-w-16 flex-col items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition ${
            pathname === "/" ? "text-white" : "text-white/70 hover:text-white"
          }`}
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
        <Link
          className={`flex min-w-16 flex-col items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition ${
            pathname === "/profile" ? "text-white" : "text-white/70 hover:text-white"
          }`}
          href="/profile"
        >
          {user ? (
            <Avatar
              name={`${user.firstName} ${user.lastName}`}
              className="h-8 w-8 border border-white/20 text-[10px]"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20">
              <UserRound className="h-4 w-4" />
            </span>
          )}
          Profile
        </Link>
      </div>
    </div>
  );
}
