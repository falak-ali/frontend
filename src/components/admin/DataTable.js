import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function DataTable({
  columns,
  data,
  page = 1,
  pageSize = 10,
  totalPages = 1,
  onPageChange,
  onSort,
  sortKey,
  sortDir,
  emptyMessage = "No data found",
}) {
  const getSortIcon = (col) => {
    if (!col.sortable || col.key !== sortKey) return <ArrowUpDown className="h-3.5 w-3.5 text-ink-300" />;
    return sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5 text-primary-600" /> : <ArrowDown className="h-3.5 w-3.5 text-primary-600" />;
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink-50/80 border-b border-ink-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={`px-4 py-3 text-left font-semibold text-ink-600 whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none hover:text-ink-900" : ""
                  } ${col.className || ""}`}
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && getSortIcon(col)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-ink-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-ink-50/40 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-ink-700 ${col.className || ""}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-ink-100 bg-ink-50/30">
          <p className="text-xs text-ink-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg text-ink-600 hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange?.(p)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                    p === page ? "bg-primary-600 text-white" : "text-ink-600 hover:bg-ink-100"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg text-ink-600 hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    available: "bg-success-50 text-success-700",
    rented: "bg-primary-50 text-primary-700",
    maintenance: "bg-warning-50 text-warning-700",
    active: "bg-success-50 text-success-700",
    pending: "bg-warning-50 text-warning-700",
    confirmed: "bg-primary-50 text-primary-700",
    completed: "bg-ink-100 text-ink-600",
    cancelled: "bg-error-50 text-error-600",
    approved: "bg-success-50 text-success-700",
    rejected: "bg-error-50 text-error-600",
    blocked: "bg-error-50 text-error-600",
  };
  return (
    <span className={`badge capitalize ${styles[status] || "bg-ink-100 text-ink-600"}`}>
      {status}
    </span>
  );
}
