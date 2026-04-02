"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Home, LogOut, UserRound } from "lucide-react";

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

export default function MobileHeader() {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-line/70 bg-white/95 backdrop-blur lg:hidden"
      style={{ height: "var(--header-height)" }}
    >
      <div
        className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6"
        style={{ minHeight: "var(--header-height)" }}
      >
        <Link href="/" className="shrink-0" aria-label="Buddy Script home">
          <Image
            src="/svgs/logo.svg"
            alt="Buddy Script"
            width={132}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl text-muted transition hover:text-accent"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
              6
            </span>
          </button>
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:opacity-90"
                  type="button"
                  aria-label="Open menu"
                >
                  <Avatar name={`${user.firstName} ${user.lastName}`} className="h-10 w-10 text-xs" />
                  <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-white text-subtle shadow-sm">
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2">
                <DropdownMenuLabel className="px-3 py-3">
                  <div className="flex items-center gap-3 normal-case tracking-normal">
                    <Avatar name={`${user.firstName} ${user.lastName}`} className="h-9 w-9 text-xs" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="truncate text-xs font-medium text-muted">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-muted" />
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-3">
                    <UserRound className="h-4 w-4 text-muted" />
                    Account
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
