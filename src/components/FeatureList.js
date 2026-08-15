import { Check } from "lucide-react";

export default function FeatureList({ features }) {
  if (!features || features.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {features.map((f) => (
        <div key={f} className="flex items-center gap-3 bg-ink-50 rounded-xl px-4 py-3">
          <span className="h-7 w-7 rounded-lg bg-primary-100 text-primary-800 flex items-center justify-center shrink-0">
            <Check className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-ink-700">{f}</span>
        </div>
      ))}
    </div>
  );
}
