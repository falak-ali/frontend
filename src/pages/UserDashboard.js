import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Car, Clock, TrendingUp, ShieldCheck, ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import bookingService from "../services/bookingService";
import EmptyState from "../components/EmptyState";
import { formatPrice, formatDate } from "../utils/format";

const statusStyles = {
  pending: "bg-warning-100 text-warning-700",
  confirmed: "bg-primary-100 text-primary-800",
  active: "bg-success-100 text-success-700",
  completed: "bg-ink-100 text-ink-600",
  cancelled: "bg-error-100 text-error-700",
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      bookingService.getByUser(user.id).then(setBookings);
    }
  }, [user]);

  const upcoming = bookings.filter((b) => b.status === "confirmed" || b.status === "pending").slice(0, 1);
  const active = bookings.filter((b) => b.status === "active").slice(0, 1);
  const previous = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");
  const totalBookings = bookings.length;
  const verification = user?.verification || { cnic: "pending", license: "pending" };
  const verStatus = verification.cnic === "approved" && verification.license === "approved" ? "approved" : verification.cnic === "rejected" ? "rejected" : "pending";

  const stats = [
    { label: "Total Bookings", value: totalBookings, icon: Calendar, color: "primary" },
    { label: "Upcoming", value: upcoming.length, icon: Clock, color: "warning" },
    { label: "Active Rental", value: active.length, icon: Car, color: "success" },
    { label: "Completed", value: previous.length, icon: TrendingUp, color: "ink" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Welcome, {user?.name?.split(" ")[0] || "User"}</h1>
      <p className="text-ink-500 text-sm mt-1">Here's an overview of your DriveEasy account.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <span className={`h-9 w-9 rounded-xl flex items-center justify-center ${
              s.color === "primary" ? "bg-primary-50 text-primary-800" :
              s.color === "warning" ? "bg-warning-100 text-warning-700" :
              s.color === "success" ? "bg-success-100 text-success-700" :
              "bg-ink-100 text-ink-600"
            }`}>
              <s.icon className="h-4.5 w-4.5" />
            </span>
            <p className="text-2xl font-extrabold text-ink-900 mt-3">{s.value}</p>
            <p className="text-xs text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Verification banner */}
      <div className={`card p-4 mt-6 flex items-center justify-between gap-4 ${
        verStatus === "approved" ? "border-success-200" : verStatus === "rejected" ? "border-error-200" : "border-warning-200"
      }`}>
        <div className="flex items-center gap-3">
          <span className={`h-10 w-10 rounded-xl flex items-center justify-center ${
            verStatus === "approved" ? "bg-success-100 text-success-600" :
            verStatus === "rejected" ? "bg-error-100 text-error-600" :
            "bg-warning-100 text-warning-600"
          }`}>
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-ink-900 text-sm">
              Verification: <span className={`capitalize ${
                verStatus === "approved" ? "text-success-600" :
                verStatus === "rejected" ? "text-error-600" : "text-warning-600"
              }`}>{verStatus}</span>
            </p>
            <p className="text-xs text-ink-500">
              {verStatus === "approved" ? "Your CNIC and license are verified." :
               verStatus === "rejected" ? "Please re-submit your documents." :
               "Submit your CNIC and driving license to get verified."}
            </p>
          </div>
        </div>
        {verStatus !== "approved" && (
          <Link to="/dashboard/verification" className="btn btn-secondary btn-sm shrink-0">
            Verify Now <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Upcoming booking */}
      <div className="mt-8">
        <h2 className="font-bold text-ink-900 mb-4">Upcoming Booking</h2>
        {upcoming.length > 0 ? (
          <BookingRow booking={upcoming[0]} />
        ) : active.length > 0 ? (
          <BookingRow booking={active[0]} />
        ) : (
          <EmptyState
            icon={Calendar}
            title="No upcoming bookings"
            description="Browse our fleet and book your next ride."
            action={<Link to="/cars" className="btn btn-primary btn-sm">Browse Fleet</Link>}
          />
        )}
      </div>

      {/* Previous bookings */}
      {previous.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink-900">Recent Bookings</h2>
            <Link to="/dashboard/bookings" className="text-sm text-primary-800 font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {previous.slice(0, 3).map((b) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingRow({ booking }) {
  return (
    <Link
      to={`/dashboard/bookings/${booking.id}`}
      className="card p-4 flex items-center gap-4 hover:shadow-lift transition-shadow"
    >
      <img src={booking.carImage} alt={booking.carName} className="h-16 w-24 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink-900 text-sm truncate">{booking.carName}</p>
        <p className="text-xs text-ink-500 mt-0.5">
          {formatDate(booking.pickupDate)} → {formatDate(booking.returnDate)}
        </p>
        <p className="text-xs text-ink-400 mt-0.5">ID: {booking.id}</p>
      </div>
      <div className="text-right shrink-0">
        <span className={`badge capitalize ${statusStyles[booking.status] || statusStyles.pending}`}>{booking.status}</span>
        <p className="text-sm font-bold text-ink-900 mt-1">{formatPrice(booking.total)}</p>
      </div>
    </Link>
  );
}
