import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Car, CreditCard } from "lucide-react";
import bookingService from "../services/bookingService";
import Loading from "../components/Loading";
import { formatPrice, formatDate } from "../utils/format";

const statusStyles = {
  pending: "bg-warning-100 text-warning-700",
  confirmed: "bg-primary-100 text-primary-800",
  active: "bg-success-100 text-success-700",
  completed: "bg-ink-100 text-ink-600",
  cancelled: "bg-error-100 text-error-700",
};

export default function BookingDetailsView() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getById(id).then(setBooking).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!booking) {
    return (
      <div>
        <p className="text-ink-500">Booking not found.</p>
        <Link to="/dashboard/bookings" className="btn btn-primary btn-sm mt-4">Back to Bookings</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/dashboard/bookings" className="btn btn-ghost btn-sm mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Bookings
      </Link>

      <div className="card overflow-hidden">
        <div className="relative h-48 sm:h-56">
          <img src={booking.carImage} alt={booking.carName} className="h-full w-full object-cover" />
          <span className={`absolute top-4 right-4 badge capitalize ${statusStyles[booking.status] || statusStyles.pending}`}>
            {booking.status}
          </span>
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-xs text-ink-400">Booking ID</p>
          <h1 className="text-xl font-extrabold text-ink-900 font-mono">{booking.id}</h1>
          <h2 className="text-lg font-bold text-ink-900 mt-3">{booking.carName}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <InfoRow icon={MapPin} label="Pickup Location" value={booking.pickupLocation} />
            <InfoRow icon={MapPin} label="Return Location" value={booking.returnLocation} />
            <InfoRow icon={Calendar} label="Pickup Date" value={formatDate(booking.pickupDate)} />
            <InfoRow icon={Calendar} label="Return Date" value={formatDate(booking.returnDate)} />
            <InfoRow icon={Clock} label="Duration" value={`${booking.days} day${booking.days !== 1 ? "s" : ""}`} />
            <InfoRow icon={Car} label="Protection" value={<span className="capitalize">{booking.protection}</span>} />
          </div>

          {/* Price breakdown */}
          <div className="mt-6 border-t border-ink-100 pt-5">
            <h3 className="font-bold text-ink-900 text-sm mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Price Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <Row label={`Base rental (${booking.days} days)`} value={formatPrice(booking.baseRental)} />
              <Row label="Protection" value={formatPrice(booking.protectionCost)} />
              <Row label="Add-ons" value={formatPrice(booking.addonsCost)} />
              <Row label="Service fee" value={formatPrice(booking.serviceFee)} />
              {booking.discount > 0 && <Row label="Discount" value={`-${formatPrice(booking.discount)}`} />}
              <div className="flex justify-between items-end pt-2 border-t border-ink-100">
                <span className="font-bold text-ink-900">Total</span>
                <span className="text-xl font-extrabold text-primary-800">{formatPrice(booking.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer info */}
          {booking.customer && (
            <div className="mt-6 border-t border-ink-100 pt-5">
              <h3 className="font-bold text-ink-900 text-sm mb-3">Customer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div><p className="text-xs text-ink-400">Name</p><p className="text-ink-900 font-medium">{booking.customer.fullName || "—"}</p></div>
                <div><p className="text-xs text-ink-400">Email</p><p className="text-ink-900 font-medium">{booking.customer.email || "—"}</p></div>
                <div><p className="text-xs text-ink-400">Phone</p><p className="text-ink-900 font-medium">{booking.customer.phone || "—"}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="h-9 w-9 rounded-lg bg-ink-50 text-ink-500 flex items-center justify-center shrink-0">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm font-medium text-ink-900 mt-0.5">{value}</p>
      </div>
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
