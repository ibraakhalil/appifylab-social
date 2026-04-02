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

        <div className="bg-surface-muted mt-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
          <p className="text-ink text-sm font-medium">Total reactions</p>
          <span className="text-muted rounded-full bg-white px-3 py-1 text-xs font-semibold">
            {users.length}
          </span>
        </div>

        {isLoading ? (
          <div className="text-muted mt-4 flex items-center gap-2 text-sm">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Loading reactions...
          </div>
        ) : error ? (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        ) : users.length ? (
          <div className="max-h-88 mt-4 space-y-3 overflow-y-auto pr-1">
            {users.map((user) => (
              <div
                key={user.id}
                className="border-line/70 bg-surface-muted/60 flex items-center gap-3 rounded-2xl border px-3 py-3"
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
                    className="text-ink hover:text-accent truncate text-sm font-medium transition"
                  >
                    {user.firstName} {user.lastName}
                  </Link>
                  <p className="text-muted truncate text-xs">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted mt-4 text-sm">No reactions yet.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
