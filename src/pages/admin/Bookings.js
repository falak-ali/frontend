import { useMemo, useState } from "react";
import { Search, Eye, Check, X, Ban, CalendarCheck, Clock, CheckCircle2, DollarSign } from "lucide-react";
import AdminModal from "../../components/admin/AdminModal";
import StatCard from "../../components/admin/StatCard";
import { StatusBadge } from "../../components/admin/DataTable";
import { adminBookings } from "../../data/adminData";
import { formatPrice, formatDate } from "../../utils/format";

const statusOptions = ["all", "pending", "confirmed", "active", "completed", "cancelled"];

export default function Bookings() {
  const [bookings, setBookings] = useState(adminBookings);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (dateFilter && b.pickupDate !== dateFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return b.id.toLowerCase().includes(q) || b.customer.toLowerCase().includes(q) || b.car.toLowerCase().includes(q);
      }
      return true;
    });
  }, [bookings, query, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = {
    total: bookings.length,
    active: bookings.filter((b) => b.status === "active").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    revenue: bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.total, 0),
  };

  const handleStatusChange = (id, status) => {
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    setSelected((s) => (s?.id === id ? { ...s, status } : s));
  };

  const columns = [
    { key: "id", label: "ID", render: (b) => <span className="font-mono text-xs font-bold text-primary-700">{b.id}</span> },
    {
      key: "customer", label: "Customer", sortable: true,
      render: (b) => <div><p className="font-semibold text-ink-900 text-sm">{b.customer}</p><p className="text-xs text-ink-500">{b.email}</p></div>,
    },
    { key: "car", label: "Vehicle", render: (b) => <span className="text-ink-700 text-sm">{b.car}</span> },
    { key: "pickupDate", label: "Pickup", render: (b) => <span className="text-ink-600 text-xs">{formatDate(b.pickupDate)}</span> },
    { key: "returnDate", label: "Return", render: (b) => <span className="text-ink-600 text-xs">{formatDate(b.returnDate)}</span> },
    { key: "total", label: "Total", sortable: true, render: (b) => <span className="font-bold text-ink-900">{formatPrice(b.total)}</span> },
    { key: "status", label: "Status", render: (b) => <StatusBadge status={b.status} /> },
    {
      key: "actions", label: "",
      render: (b) => (
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => setSelected(b)} className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-100 hover:text-primary-600"><Eye className="h-4 w-4" /></button>
          {b.status === "pending" && (
            <>
              <button onClick={() => handleStatusChange(b.id, "confirmed")} className="p-1.5 rounded-lg text-success-600 hover:bg-success-50" title="Approve"><Check className="h-4 w-4" /></button>
              <button onClick={() => handleStatusChange(b.id, "cancelled")} className="p-1.5 rounded-lg text-error-600 hover:bg-error-50" title="Reject"><X className="h-4 w-4" /></button>
            </>
          )}
          {(b.status === "confirmed" || b.status === "active") && (
            <button onClick={() => handleStatusChange(b.id, "cancelled")} className="p-1.5 rounded-lg text-error-600 hover:bg-error-50" title="Cancel"><Ban className="h-4 w-4" /></button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={stats.total} icon={CalendarCheck} color="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} color="success" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="warning" />
        <StatCard label="Total Revenue" value={formatPrice(stats.revenue)} icon={DollarSign} color="success" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input type="text" placeholder="Search by ID, customer, or vehicle…" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="form-field pl-10" />
        </div>
        <input type="date" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} className="form-field sm:w-44" />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="form-field sm:w-36">
          {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s === "all" ? "All Status" : s}</option>)}
        </select>
        {(query || statusFilter !== "all" || dateFilter) && (
          <button onClick={() => { setQuery(""); setStatusFilter("all"); setDateFilter(""); setPage(1); }} className="btn btn-ghost btn-sm">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden">
          <thead>
            <tr className="bg-ink-50/80 border-b border-ink-100">
              {columns.map((col) => <th key={col.key} className={`px-4 py-3 text-left font-semibold text-ink-600 whitespace-nowrap ${col.label === "" ? "text-right" : ""}`}>{col.label}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {paginated.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-ink-400">No bookings found</td></tr>
            ) : paginated.map((b) => (
              <tr key={b.id} className="hover:bg-ink-50/40">
                {columns.map((col) => <td key={col.key} className="px-4 py-3">{col.render(b)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-500">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</p>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-600 hover:bg-ink-100 disabled:opacity-40">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`h-8 w-8 rounded-lg text-xs font-semibold ${i + 1 === page ? "bg-primary-600 text-white" : "text-ink-600 hover:bg-ink-100"}`}>{i + 1}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-600 hover:bg-ink-100 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      <AdminModal open={!!selected} onClose={() => setSelected(null)} title={`Booking ${selected?.id || ""}`} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Info label="Customer" value={selected.customer} />
              <Info label="Email" value={selected.email} />
              <Info label="Vehicle" value={selected.car} />
              <Info label="Payment" value={<span className="capitalize">{selected.payment}</span>} />
              <Info label="Pickup" value={`${selected.pickupLocation} · ${formatDate(selected.pickupDate)}`} />
              <Info label="Return" value={formatDate(selected.returnDate)} />
              <Info label="Duration" value={`${selected.days} days`} />
              <Info label="Status" value={<StatusBadge status={selected.status} />} />
            </div>

            <div className="bg-ink-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600">Base ({selected.days} × {formatPrice(Math.round(selected.total / selected.days))})</span>
                <span className="font-semibold text-ink-900">{formatPrice(selected.total)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-ink-200">
                <span className="font-bold text-ink-900">Total</span>
                <span className="text-lg font-extrabold text-primary-700">{formatPrice(selected.total)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selected.status === "pending" && (
                <>
                  <button onClick={() => handleStatusChange(selected.id, "confirmed")} className="btn btn-primary btn-sm"><Check className="h-4 w-4" /> Approve</button>
                  <button onClick={() => handleStatusChange(selected.id, "cancelled")} className="btn btn-secondary btn-sm text-error-600 border-error-200 hover:bg-error-50"><X className="h-4 w-4" /> Reject</button>
                </>
              )}
              {selected.status === "confirmed" && (
                <button onClick={() => handleStatusChange(selected.id, "active")} className="btn btn-primary btn-sm"><Check className="h-4 w-4" /> Activate</button>
              )}
              {selected.status === "active" && (
                <button onClick={() => handleStatusChange(selected.id, "completed")} className="btn btn-primary btn-sm"><Check className="h-4 w-4" /> Mark Complete</button>
              )}
              {(selected.status === "confirmed" || selected.status === "active") && (
                <button onClick={() => handleStatusChange(selected.id, "cancelled")} className="btn btn-secondary btn-sm text-error-600 border-error-200 hover:bg-error-50"><Ban className="h-4 w-4" /> Cancel</button>
              )}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-ink-400">{label}</p>
      <p className="text-sm font-medium text-ink-900 mt-0.5">{value}</p>
    </div>
  );
}
