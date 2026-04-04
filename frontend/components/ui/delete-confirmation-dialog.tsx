"use client";

import { LoaderCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteConfirmationDialogProps = {
  confirmLabel?: string;
  description: string;
  error?: string | null;
  isDeleting?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

export default function DeleteConfirmationDialog({
  confirmLabel = "Delete",
  description,
  error = null,
  isDeleting = false,
  onConfirm,
  onOpenChange,
  open,
  title,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="border-line text-ink hover:bg-surface-muted rounded-full border px-5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex min-w-28 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
