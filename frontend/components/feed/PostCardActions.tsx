"use client";

import type { LucideIcon } from "lucide-react";
import { Bookmark, FilePenLine, Link2, MoreHorizontal, ShieldAlert, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PostMenuItem = {
  className?: string;
  icon: LucideIcon;
  label: string;
  requiresOwnership?: boolean;
};

const postMenuItems: PostMenuItem[] = [
  {
    icon: FilePenLine,
    label: "Edit post",
    requiresOwnership: true,
  },
  {
    icon: Trash2,
    label: "Delete post",
    className: "text-red-600 focus:bg-red-50 focus:text-red-600",
    requiresOwnership: true,
  },
  {
    icon: Bookmark,
    label: "Save post",
  },
  {
    icon: Link2,
    label: "Copy link",
  },
  {
    icon: ShieldAlert,
    label: "Report post",
  },
];

type PostCardActionsProps = {
  canManagePost: boolean;
};

export default function PostCardActions({ canManagePost }: PostCardActionsProps) {
  const visibleMenuItems = postMenuItems.filter((item) => !item.requiresOwnership || canManagePost);
  const ownedActionCount = visibleMenuItems.filter((item) => item.requiresOwnership).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-surface-muted text-muted hover:bg-accent/10 hover:text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition"
          type="button"
          aria-label="More post options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-2">
        <DropdownMenuLabel>Post actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visibleMenuItems.map((item, index) => {
          const Icon = item.icon;
          const showSeparator = item.requiresOwnership && index === ownedActionCount - 1;

          return (
            <div key={item.label}>
              <DropdownMenuItem className={item.className}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
              {showSeparator ? <DropdownMenuSeparator /> : null}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
