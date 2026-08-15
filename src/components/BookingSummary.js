import { formatPrice } from "../utils/format";

// Displays the live order summary used in the booking flow and car details.
export default function BookingSummary({ car, summary, protectionPlan, addons = {}, promoCode, compact = false }) {
  if (!car || !summary) return null;

  return (
    <div className={`card ${compact ? "p-4" : "p-5"} space-y-3`}>
      <div className="flex items-center gap-3 pb-3 border-b border-ink-100">
        <img src={car.images?.[0]} alt={car.name} className="h-14 w-20 rounded-lg object-cover" />
        <div className="min-w-0">
          <p className="font-semibold text-ink-900 text-sm truncate">{car.name}</p>
          <p className="text-xs text-ink-500">{car.category} · {formatPrice(car.pricePerDay)}/day</p>
        </div>
      </div>

      <Row label={`Base rental (${summary.days} day${summary.days !== 1 ? "s" : ""})`} value={formatPrice(summary.baseRental)} />

      {protectionPlan && protectionPlan.dailyPrice > 0 && (
        <Row label={`${protectionPlan.name} protection`} value={formatPrice(summary.protectionCost)} />
      )}

      {summary.addonsCost > 0 && (
        <Row label="Add-ons" value={formatPrice(summary.addonsCost)} />
      )}

      <Row label="Service fee" value={formatPrice(summary.serviceFee)} />

      {summary.discount > 0 && (
        <Row label={`Promo discount${promoCode ? ` (${promoCode})` : ""}`} value={`-${formatPrice(summary.discount)}`} highlight="success" />
      )}

      <div className="border-t border-ink-100 pt-3 flex items-center justify-between">
        <span className="font-bold text-ink-900">Total</span>
        <span className="text-xl font-extrabold text-primary-800">{formatPrice(summary.total)}</span>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  const color = highlight === "success" ? "text-success-600" : "text-ink-900";
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-500">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}
