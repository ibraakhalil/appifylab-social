"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Search } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";

export default function MobileHeader() {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-semibold text-ink">
          Buddy Script
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
          {isAuthenticated && user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-surface-muted px-2 py-1.5 text-muted transition hover:bg-accent/10 hover:text-accent"
              aria-label="Logout"
            >
              <Avatar name={`${user.firstName} ${user.lastName}`} className="h-8 w-8 text-xs" />
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
