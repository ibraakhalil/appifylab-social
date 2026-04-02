"use client";

import Link from "next/link";
import { LoaderCircle } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ApiUser } from "@/lib/api/types";

import { buildProfileHref } from "./feedUtils";

type ReactionUsersDialogProps = {
  description: string;
  error: string | null;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
  users: ApiUser[];
};

export default function ReactionUsersDialog({
  description,
  error,
  isLoading,
  onOpenChange,
  open,
  title,
  users,
}: ReactionUsersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-surface-muted px-4 py-3">
          <p className="text-sm font-medium text-ink">Total reactions</p>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted">
            {users.length}
          </span>
        </div>

        {isLoading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Loading reactions...
          </div>
        ) : error ? (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        ) : users.length ? (
          <div className="mt-4 max-h-88 space-y-3 overflow-y-auto pr-1">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-2xl border border-line/70 bg-surface-muted/60 px-3 py-3"
              >
                <Link href={buildProfileHref(user.id)} className="shrink-0">
                  <Avatar
                    name={`${user.firstName} ${user.lastName}`}
                    className="h-9 w-9 shrink-0 text-xs"
                  />
                </Link>
                <div className="min-w-0">
                  <Link
                    href={buildProfileHref(user.id)}
                    className="truncate text-sm font-medium text-ink transition hover:text-accent"
                  >
                    {user.firstName} {user.lastName}
                  </Link>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">No reactions yet.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
