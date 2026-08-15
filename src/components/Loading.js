import { Loader2 } from "lucide-react";

export default function Loading({ label = "Loading…" }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 text-primary-800 animate-spin" />
      <p className="text-sm text-ink-500">{label}</p>
    </div>
  );
}
