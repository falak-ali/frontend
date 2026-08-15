import { useEffect, useState } from "react";
import { Search, Eye, X } from "lucide-react";
import bookingService from "../services/bookingService";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import { formatPrice, formatDate } from "../utils/format";

const statusOptions = ["all", "pending", "confirmed", "active", "completed", "cancelled"];
const statusStyles = {
  pending: "bg-warning-100 text-warning-700",
  confirmed: "bg-primary-100 text-primary-800",
  active: "bg-success-100 text-success-700",
  completed: "bg-ink-100 text-ink-600",
  cancelled: "bg-error-100 text-error-700",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    bookingService.getAll().then((b) => {
      setBookings(b);
      setLoading(false);
    });
  }, []);

  const filtered = bookings.filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      return b.id.toLowerCase().includes(q) ||
        b.carName?.toLowerCase().includes(q) ||
        b.customer?.fullName?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleStatusChange = async (id, status) => {
    const updated = await bookingService.updateStatus(id, status);
    setBookings((bs) => bs.map((b) => (b.id === id ? updated : b)));
    setSelected(updated);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Manage Bookings</h1>
      <p className="text-ink-500 text-sm mt-1">{bookings.length} total bookings</p>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-ink-400" />
          <input
            type="text"
            placeholder="Search by ID, car, or customer…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-field pl-10"
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="form-field sm:w-48">
          {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s === "all" ? "All Status" : s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No bookings found" />
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map((b) => (
            <div key={b.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <img src={b.carImage} alt={b.carName} className="h-14 w-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-900 text-sm truncate">{b.carName}</p>
                <p className="text-xs text-ink-500 mt-0.5">{b.id} · {b.customer?.fullName || "—"}</p>
                <p className="text-xs text-ink-400">{formatDate(b.pickupDate)} → {formatDate(b.returnDate)}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`badge capitalize ${statusStyles[b.status] || statusStyles.pending}`}>{b.status}</span>
                <p className="text-sm font-bold text-ink-900">{formatPrice(b.total)}</p>
                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  className="form-field text-xs py-1.5 px-2 w-32"
                >
                  {statusOptions.filter((s) => s !== "all").map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
                <button onClick={() => setSelected(b)} className="btn btn-ghost btn-sm">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Booking ${selected?.id || ""}`}
      >
        {selected && (
          <div className="space-y-4">
            <img src={selected.carImage} alt={selected.carName} className="w-full h-40 rounded-xl object-cover" />
            <div>
              <p className="font-bold text-ink-900">{selected.carName}</p>
              <p className="text-sm text-ink-500">{selected.customer?.fullName} · {selected.customer?.email} · {selected.customer?.phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Pickup" value={`${selected.pickupLocation} — ${formatDate(selected.pickupDate)}`} />
              <Info label="Return" value={`${selected.returnLocation} — ${formatDate(selected.returnDate)}`} />
              <Info label="Duration" value={`${selected.days} days`} />
              <Info label="Protection" value={<span className="capitalize">{selected.protection}</span>} />
            </div>
            <div className="border-t border-ink-100 pt-3 space-y-1.5 text-sm">
              <Row label="Base rental" value={formatPrice(selected.baseRental)} />
              <Row label="Protection" value={formatPrice(selected.protectionCost)} />
              <Row label="Add-ons" value={formatPrice(selected.addonsCost)} />
              <Row label="Service fee" value={formatPrice(selected.serviceFee)} />
              {selected.discount > 0 && <Row label="Discount" value={`-${formatPrice(selected.discount)}`} />}
              <div className="flex justify-between pt-2 border-t border-ink-100">
                <span className="font-bold">Total</span>
                <span className="font-extrabold text-primary-800">{formatPrice(selected.total)}</span>
              </div>
            </div>
            <div>
              <label className="label">Update Status</label>
              <select
                value={selected.status}
                onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                className="form-field"
              >
                {statusOptions.filter((s) => s !== "all").map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
          </div>
        )}
      </Modal>
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

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-500">{label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  );
}
