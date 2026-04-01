import { LoaderCircle } from "lucide-react";

export default function FeedLoadingState() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center rounded-lg border border-white/70 bg-white p-6 shadow-[0_18px_45px_rgba(17,32,50,0.08)]">
      <div className="flex items-center gap-3 text-sm font-medium text-muted">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Loading your feed...
      </div>
    </div>
  );
}
