import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, page + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="h-9 w-9 rounded-lg border border-ink-200 flex items-center justify-center disabled:opacity-40 hover:bg-ink-50 transition"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onChange(1)} className="h-9 w-9 rounded-lg border border-ink-200 text-sm font-medium hover:bg-ink-50">1</button>
          {start > 2 && <span className="px-1 text-ink-400">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
            p === page
              ? "bg-primary-800 text-white border border-primary-800"
              : "border border-ink-200 hover:bg-ink-50"
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-ink-400">…</span>}
          <button onClick={() => onChange(totalPages)} className="h-9 w-9 rounded-lg border border-ink-200 text-sm font-medium hover:bg-ink-50">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="h-9 w-9 rounded-lg border border-ink-200 flex items-center justify-center disabled:opacity-40 hover:bg-ink-50 transition"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
