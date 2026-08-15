import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, Download, ArrowRight, MapPin, Calendar, Clock, Car, User, Mail, Phone } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import bookingService from "../services/bookingService";
import { formatPrice, formatDate } from "../utils/format";

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { confirmedBooking } = useBooking();
  const [booking, setBooking] = useState(confirmedBooking);
  const [loading, setLoading] = useState(!confirmedBooking);

  useEffect(() => {
    if (!booking && bookingId) {
      bookingService.getById(bookingId).then((b) => {
        setBooking(b);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [bookingId, booking]);

  if (loading) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink-500">Loading confirmation…</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink-500">Booking not found.</p>
        <Link to="/cars" className="btn btn-primary btn-sm mt-4">Browse Fleet</Link>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    const invoice = buildInvoice(booking);
    const blob = new Blob([invoice], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DriveEasy-Invoice-${booking.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-page py-10 max-w-2xl">
      <div className="card p-6 sm:p-8 text-center animate-fade-up">
        <div className="mx-auto h-16 w-16 rounded-full bg-success-100 flex items-center justify-center">
          <CheckCircle2 className="h-9 w-9 text-success-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mt-5">Booking Confirmed!</h1>
        <p className="text-ink-500 mt-2">
          Your reservation has been placed successfully. A confirmation has been sent to your email.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 bg-primary-50 text-primary-800 rounded-xl px-4 py-2">
          <span className="text-sm font-medium">Booking ID:</span>
          <span className="font-bold font-mono">{booking.id}</span>
        </div>
      </div>

      {/* Customer details */}
      {booking.customer && (booking.customer.fullName || booking.customer.email || booking.customer.phone) && (
        <div className="card p-5 mt-6">
          <h2 className="font-bold text-ink-900 text-sm mb-3">Customer Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {booking.customer.fullName && (
              <div className="flex items-center gap-2 text-ink-600">
                <User className="h-4 w-4 text-ink-400 shrink-0" />
                <span className="truncate">{booking.customer.fullName}</span>
              </div>
            )}
            {booking.customer.email && (
              <div className="flex items-center gap-2 text-ink-600">
                <Mail className="h-4 w-4 text-ink-400 shrink-0" />
                <span className="truncate">{booking.customer.email}</span>
              </div>
            )}
            {booking.customer.phone && (
              <div className="flex items-center gap-2 text-ink-600">
                <Phone className="h-4 w-4 text-ink-400 shrink-0" />
                <span>{booking.customer.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Car card */}
      <div className="card p-5 mt-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            src={booking.carImage}
            alt={booking.carName}
            className="w-full sm:w-40 h-32 sm:h-28 rounded-xl object-cover"
          />
          <div className="flex-1">
            <span className="badge bg-primary-100 text-primary-800">{booking.carName}</span>
            <h2 className="font-bold text-ink-900 mt-2 text-lg">{booking.carName}</h2>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div className="flex items-center gap-2 text-ink-600">
                <MapPin className="h-4 w-4 text-ink-400" />
                <span>{booking.pickupLocation}</span>
              </div>
              <div className="flex items-center gap-2 text-ink-600">
                <Calendar className="h-4 w-4 text-ink-400" />
                <span>{formatDate(booking.pickupDate)} → {formatDate(booking.returnDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-ink-600">
                <Clock className="h-4 w-4 text-ink-400" />
                <span>{booking.days} day{booking.days !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-ink-600">
                <Car className="h-4 w-4 text-ink-400" />
                <span className="capitalize">{booking.protection} protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="card p-5 mt-6 space-y-2.5">
        <h2 className="font-bold text-ink-900 text-sm mb-2">Payment Breakdown</h2>
        <BreakdownRow label={`Base rental (${booking.days} day${booking.days !== 1 ? "s" : ""})`} value={formatPrice(booking.baseRental)} />
        {booking.protectionCost > 0 && (
          <BreakdownRow label="Protection plan" value={formatPrice(booking.protectionCost)} />
        )}
        {booking.addonsCost > 0 && (
          <BreakdownRow label="Add-ons" value={formatPrice(booking.addonsCost)} />
        )}
        <BreakdownRow label="Service fee" value={formatPrice(booking.serviceFee)} />
        {booking.discount > 0 && (
          <BreakdownRow label={`Discount${booking.promoCode ? ` (${booking.promoCode})` : ""}`} value={`-${formatPrice(booking.discount)}`} highlight />
        )}
        <div className="border-t border-ink-100 pt-3 flex items-center justify-between">
          <span className="font-bold text-ink-900">Total Paid</span>
          <span className="text-2xl font-extrabold text-primary-800">{formatPrice(booking.total)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        <button onClick={handleDownloadInvoice} className="btn btn-secondary btn-lg">
          <Download className="h-5 w-5" /> Download Invoice
        </button>
        <button onClick={() => navigate("/dashboard/bookings")} className="btn btn-primary btn-lg">
          View My Bookings <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="text-center mt-6">
        <Link to="/dashboard" className="text-sm text-primary-800 font-medium hover:underline">
          Manage Reservation →
        </Link>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-500">{label}</span>
      <span className={`font-semibold ${highlight ? "text-success-600" : "text-ink-900"}`}>{value}</span>
    </div>
  );
}

function buildInvoice(b) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>DriveEasy Invoice ${b.id}</title>
<style>
body{font-family:Inter,Arial,sans-serif;max-width:640px;margin:40px auto;padding:20px;color:#0f172a}
h1{color:#063B9F}.info{background:#f6f7f9;padding:16px;border-radius:12px;margin:16px 0}
table{width:100%;border-collapse:collapse;margin:16px 0}
td{padding:8px 0;border-bottom:1px solid #eceef2}.right{text-align:right}.total{font-size:20px;font-weight:bold;color:#063B9F}
</style></head><body>
<h1>DriveEasy</h1>
<p>Invoice #${b.id}<br>Date: ${new Date().toLocaleDateString()}</p>
<div class="info">
<strong>Customer:</strong> ${b.customer?.fullName || "—"}<br>
<strong>Email:</strong> ${b.customer?.email || "—"}<br>
<strong>Phone:</strong> ${b.customer?.phone || "—"}
</div>
<h2>${b.carName}</h2>
<table>
<tr><td>Pickup</td><td class="right">${b.pickupLocation} — ${formatDate(b.pickupDate)}</td></tr>
<tr><td>Return</td><td class="right">${b.returnLocation} — ${formatDate(b.returnDate)}</td></tr>
<tr><td>Duration</td><td class="right">${b.days} days</td></tr>
<tr><td>Base rental</td><td class="right">${formatPrice(b.baseRental)}</td></tr>
<tr><td>Protection</td><td class="right">${formatPrice(b.protectionCost)}</td></tr>
<tr><td>Add-ons</td><td class="right">${formatPrice(b.addonsCost)}</td></tr>
<tr><td>Service fee</td><td class="right">${formatPrice(b.serviceFee)}</td></tr>
${b.discount > 0 ? `<tr><td>Discount</td><td class="right">-${formatPrice(b.discount)}</td></tr>` : ""}
</table>
<p class="total">Total Paid: ${formatPrice(b.total)}</p>
<p style="color:#67718d;font-size:13px;margin-top:32px">Thank you for choosing DriveEasy. This is a computer-generated invoice.</p>
</body></html>`;
}
