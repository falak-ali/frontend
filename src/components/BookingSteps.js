import { Check } from "lucide-react";

// Progress indicator for the 3-step booking flow.
const steps = [
  { num: 1, label: "Details" },
  { num: 2, label: "Add-ons" },
  { num: 3, label: "Payment" },
];

export default function BookingSteps({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {steps.map((s, i) => {
        const done = s.num < current;
        const active = s.num === current;
        return (
          <div key={s.num} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  done
                    ? "bg-success-500 text-white"
                    : active
                    ? "bg-primary-800 text-white"
                    : "bg-ink-100 text-ink-400"
                }`}
              >
                {done ? <Check className="h-4.5 w-4.5" /> : s.num}
              </span>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  active ? "text-primary-800" : done ? "text-ink-700" : "text-ink-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-8 sm:w-16 rounded ${done ? "bg-success-500" : "bg-ink-100"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
