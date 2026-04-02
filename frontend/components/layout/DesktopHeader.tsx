"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, House, LogOut, Search, UserRound, UsersRound } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";

export default function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header
      className="sticky top-0 z-50 hidden border-b border-line/70 bg-white/90 backdrop-blur lg:block"
      style={{ height: "var(--header-height)" }}
    >
      <div
        className="mx-auto flex max-w-[1440px] items-center gap-5 px-6 xl:px-8"
        style={{ minHeight: "var(--header-height)" }}
      >
        <Link href="/" className="shrink-0 text-lg font-semibold text-ink">
          Buddy Script
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
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
              pathname === "/"
                ? "bg-accent/10 text-accent"
                : "text-muted hover:bg-surface-muted hover:text-accent"
            }`}
            href="/"
            aria-label="Home"
          >
            <House className="h-5 w-5" />
          </Link>
          <Link
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
              pathname === "/profile"
                ? "bg-accent/10 text-accent"
                : "text-muted hover:bg-surface-muted hover:text-accent"
            }`}
            href="/profile"
            aria-label="Profile"
          >
            <UserRound className="h-5 w-5" />
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

        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-full border border-line bg-white px-2.5 py-1.5 shadow-sm transition hover:border-accent/40 hover:shadow-[0_12px_30px_rgba(17,32,50,0.08)]"
            >
              <Avatar name={`${user.firstName} ${user.lastName}`} className="h-10 w-10 text-sm" />
              <div className="hidden text-left xl:block">
                <p className="text-sm font-semibold text-ink">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            </Link>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-white text-muted shadow-sm transition hover:border-accent/40 hover:text-accent"
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-strong"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
