import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import bookingService from "../services/bookingService";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import { formatPrice, formatDate } from "../utils/format";

const statusStyles = {
  pending: "bg-warning-100 text-warning-700",
  confirmed: "bg-primary-100 text-primary-800",
  active: "bg-success-100 text-success-700",
  completed: "bg-ink-100 text-ink-600",
  cancelled: "bg-error-100 text-error-700",
};

const filters = ["all", "confirmed", "active", "completed", "cancelled", "pending"];

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user) {
      bookingService.getByUser(user.id).then(setBookings).finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <Loading />;

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">My Bookings</h1>
      <p className="text-ink-500 text-sm mt-1">View and manage all your reservations.</p>

      <div className="flex flex-wrap gap-2 mt-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition border ${
              filter === f ? "bg-primary-800 text-white border-primary-800" : "bg-white text-ink-600 border-ink-200 hover:border-primary-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings found"
          description={filter === "all" ? "You haven't made any bookings yet." : `No ${filter} bookings.`}
          action={<Link to="/cars" className="btn btn-primary btn-sm">Browse Fleet</Link>}
        />
      ) : (
        <div className="space-y-3 mt-5">
          {filtered.map((b) => (
            <div key={b.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <img src={b.carImage} alt={b.carName} className="h-16 w-24 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-900 text-sm truncate">{b.carName}</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  {formatDate(b.pickupDate)} → {formatDate(b.returnDate)}
                </p>
                <p className="text-xs text-ink-400 mt-0.5">Booking ID: {b.id}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className={`badge capitalize ${statusStyles[b.status] || statusStyles.pending}`}>{b.status}</span>
                  <p className="text-sm font-bold text-ink-900 mt-1">{formatPrice(b.total)}</p>
                </div>
                <Link to={`/dashboard/bookings/${b.id}`} className="btn btn-secondary btn-sm">
                  <Eye className="h-4 w-4" /> View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
