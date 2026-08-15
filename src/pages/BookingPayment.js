import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Lock, User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import BookingSteps from "../components/BookingSteps";
import BookingSummary from "../components/BookingSummary";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import bookingService from "../services/bookingService";
import { formatPrice } from "../utils/format";

export default function BookingPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { car, summary, pickupLocation, returnLocation, pickupDate, returnDate, protection, addons, promoCode, promoDiscount, customer, payment, update, reset } = useBooking();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && !customer.fullName && !customer.email && !customer.phone) {
      update({
        customer: {
          fullName: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        },
      });
    }
  }, [user, customer, update]);

  if (!car) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink-500">No active booking. Start by choosing a car.</p>
        <Link to="/cars" className="btn btn-primary btn-sm mt-4">Browse Fleet</Link>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!customer.fullName.trim()) e.fullName = "Full name is required";
    if (!customer.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(customer.email)) e.email = "Enter a valid email";
    if (!customer.phone.trim()) e.phone = "Phone number is required";
    if (!payment.cardNumber.trim()) e.cardNumber = "Card number is required";
    else if (payment.cardNumber.replace(/\s/g, "").length < 13) e.cardNumber = "Enter a valid card number";
    if (!payment.expiry.trim()) e.expiry = "Expiry is required";
    if (!payment.cvv.trim()) e.cvv = "CVV is required";
    else if (payment.cvv.length < 3) e.cvv = "Enter a valid CVV";
    if (!payment.billingAddress.trim()) e.billingAddress = "Billing address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const bookingData = {
        userId: user?.id || "guest",
        carId: car.id,
        carName: car.name,
        carImage: car.images?.[0],
        pickupLocation,
        returnLocation,
        pickupDate,
        returnDate,
        days: summary.days,
        protection,
        addons,
        promoCode,
        promoDiscount,
        baseRental: summary.baseRental,
        protectionCost: summary.protectionCost,
        addonsCost: summary.addonsCost,
        serviceFee: summary.serviceFee,
        discount: summary.discount,
        total: summary.total,
        customer,
      };

      const confirmed = await bookingService.create(bookingData);
      const bookingId = confirmed.id;
      reset();
      // Keep the confirmed booking in a temp state for the confirmation page
      update({ confirmedBooking: confirmed });
      navigate(`/booking/${bookingId}/confirmation`);
    } catch (err) {
      setErrors({ submit: err.message || "Payment failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-8 max-w-5xl">
      <BookingSteps current={3} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          {/* Customer info */}
          <section className="card p-5 sm:p-6">
            <h2 className="font-bold text-ink-900 mb-1">Customer Information</h2>
            <p className="text-sm text-ink-500 mb-5">Enter the primary driver's details.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Full Name</label>
                <input
                  type="text"
                  value={customer.fullName}
                  onChange={(e) => update({ customer: { ...customer, fullName: e.target.value } })}
                  placeholder="e.g. Ahmed Raza"
                  className="form-field"
                />
                {errors.fullName && <p className="text-xs text-error-600 mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => update({ customer: { ...customer, email: e.target.value } })}
                  placeholder="you@example.com"
                  className="form-field"
                />
                {errors.email && <p className="text-xs text-error-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => update({ customer: { ...customer, phone: e.target.value } })}
                  placeholder="0300-1234567"
                  className="form-field"
                />
                {errors.phone && <p className="text-xs text-error-600 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </section>

          {/* Payment method */}
          <section className="card p-5 sm:p-6">
            <h2 className="font-bold text-ink-900 mb-1 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary-800" /> Payment Method
            </h2>
            <p className="text-sm text-ink-500 mb-5">This is a simulated payment. No real charge will be made.</p>

            <div className="space-y-4">
              <div>
                <label className="label">Card Number</label>
                <input
                  type="text"
                  value={payment.cardNumber}
                  onChange={(e) => update({ payment: { ...payment, cardNumber: formatCardNumber(e.target.value) } })}
                  placeholder="4242 4242 4242 4242"
                  className="form-field font-mono"
                  maxLength={19}
                />
                {errors.cardNumber && <p className="text-xs text-error-600 mt-1">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={payment.expiry}
                    onChange={(e) => update({ payment: { ...payment, expiry: formatExpiry(e.target.value) } })}
                    placeholder="12/27"
                    className="form-field font-mono"
                    maxLength={5}
                  />
                  {errors.expiry && <p className="text-xs text-error-600 mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="label">CVV</label>
                  <input
                    type="text"
                    value={payment.cvv}
                    onChange={(e) => update({ payment: { ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) } })}
                    placeholder="123"
                    className="form-field font-mono"
                    maxLength={4}
                  />
                  {errors.cvv && <p className="text-xs text-error-600 mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <div>
                <label className="label flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Billing Address</label>
                <textarea
                  value={payment.billingAddress}
                  onChange={(e) => update({ payment: { ...payment, billingAddress: e.target.value } })}
                  placeholder="House #, Street, Area, City"
                  className="form-field min-h-[72px] resize-none"
                />
                {errors.billingAddress && <p className="text-xs text-error-600 mt-1">{errors.billingAddress}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-ink-500 mt-4 bg-ink-50 rounded-lg px-3 py-2.5">
              <Lock className="h-3.5 w-3.5" />
              Your payment information is encrypted and secure. This is a demo — no real payment is processed.
            </div>
          </section>

          {errors.submit && (
            <div className="card border-error-200 bg-error-50 p-4 text-sm text-error-700">
              {errors.submit}
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between gap-3">
            <Link to={`/booking/${car.id}/addons`} className="btn btn-secondary">
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
            <button onClick={handlePay} disabled={submitting} className="btn btn-primary btn-lg">
              {submitting ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Processing…</>
              ) : (
                <>Pay {formatPrice(summary.total)} Now</>
              )}
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 self-start">
          <BookingSummary
            car={car}
            summary={summary}
            protectionPlan={summary.protectionPlan}
            addons={addons}
            promoCode={promoCode}
            compact
          />
        </aside>
      </div>
    </div>
  );
}
