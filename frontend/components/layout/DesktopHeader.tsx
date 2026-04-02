"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Home, LogOut, Search, UserRound } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export default function DesktopHeader() {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header
      className="border-line/70 sticky top-0 z-50 hidden border-b bg-white/90 backdrop-blur lg:block"
      style={{ height: "var(--header-height)" }}
    >
      <div
        className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-6 xl:px-8"
        style={{ minHeight: "var(--header-height)" }}
      >
        <Link href="/" className="shrink-0" aria-label="Buddy Script home">
          <Image
            src="/svgs/logo.svg"
            alt="Buddy Script"
            width={144}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <form className="relative hidden max-w-md flex-1 lg:block">
          <Search className="text-subtle pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            className="bg-surface-muted text-ink focus:border-accent/50 h-11 w-full rounded-full border border-transparent pl-11 pr-4 text-sm outline-none transition focus:bg-white"
            type="search"
            placeholder="Search people, groups, and posts"
            aria-label="Search"
          />
        </form>
        <div className="flex items-center gap-4">
          <nav className="ml-auto">
            <button
              className="text-muted hover:text-accent relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition"
              type="button"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="bg-accent absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white">
                6
              </span>
            </button>
          </nav>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative flex h-11 w-11 items-center justify-center rounded-full transition hover:opacity-90"
                  type="button"
                  aria-label="Open menu"
                >
                  <Avatar
                    name={`${user.firstName} ${user.lastName}`}
                    className="h-11 w-11 text-sm"
                  />
                  <span className="text-subtle absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-white shadow-sm">
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel className="px-3 py-3">
                  <div className="flex items-center gap-3 normal-case tracking-normal">
                    <Avatar
                      name={`${user.firstName} ${user.lastName}`}
                      className="h-10 w-10 text-sm"
                    />
                    <div className="min-w-0">
                      <p className="text-ink truncate text-sm font-semibold">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-muted truncate text-xs font-medium">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center gap-3">
                    <Home className="text-muted h-4 w-4" />
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-3">
                    <UserRound className="text-muted h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-red-600 focus:bg-red-50 focus:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="bg-accent hover:bg-accent-strong size-11 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition"></div>
          )}
        </div>
      </div>
    </header>
  );
}
