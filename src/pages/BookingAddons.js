import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Tag, X, Navigation, Baby, Users, Wifi } from "lucide-react";
import BookingSteps from "../components/BookingSteps";
import BookingSummary from "../components/BookingSummary";
import { useBooking, ADDONS } from "../context/BookingContext";
import { formatPrice } from "../utils/format";

const iconMap = { Navigation, Baby, Users, Wifi };

const PROMO_CODES = {
  DRIVE15: 15,
  WELCOME10: 10,
  SUMMER5: 5,
};

export default function BookingAddons() {
  const navigate = useNavigate();
  const { car, addons, toggleAddon, summary, promoCode, promoDiscount, update } = useBooking();
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoError, setPromoError] = useState("");

  if (!car) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink-500">No active booking. Start by choosing a car.</p>
        <Link to="/cars" className="btn btn-primary btn-sm mt-4">Browse Fleet</Link>
      </div>
    );
  }

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError("Enter a promo code.");
      return;
    }
    if (PROMO_CODES[code]) {
      update({ promoCode: code, promoDiscount: PROMO_CODES[code] });
      setPromoError("");
    } else {
      setPromoError("Invalid promo code.");
    }
  };

  const handleRemovePromo = () => {
    setPromoInput("");
    setPromoError("");
    update({ promoCode: "", promoDiscount: 0 });
  };

  const handleNext = () => navigate(`/booking/${car.id}/payment`);

  return (
    <div className="container-page py-8 max-w-5xl">
      <BookingSteps current={2} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          {/* Add-ons */}
          <section className="card p-5 sm:p-6">
            <h2 className="font-bold text-ink-900 mb-1">Add-ons & Extras</h2>
            <p className="text-sm text-ink-500 mb-5">Customise your rental with optional extras. Prices are per day.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADDONS.map((addon) => {
                const enabled = !!addons[addon.id];
                const Icon = iconMap[addon.icon] || Navigation;
                return (
                  <div
                    key={addon.id}
                    className={`rounded-2xl border-2 p-4 transition-all ${
                      enabled ? "border-primary-800 bg-primary-50/40" : "border-ink-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="h-10 w-10 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-ink-900 text-sm">{addon.name}</p>
                          <p className="text-xs text-ink-500 mt-0.5">{addon.description}</p>
                          <p className="text-sm font-bold text-primary-800 mt-1.5">
                            {formatPrice(addon.dailyPrice)}<span className="text-xs font-normal text-ink-500"> /day</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAddon(addon.id)}
                        className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${
                          enabled ? "bg-primary-800" : "bg-ink-200"
                        }`}
                        aria-label={`Toggle ${addon.name}`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                          enabled ? "left-[22px]" : "left-0.5"
                        }`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Promo code */}
          <section className="card p-5 sm:p-6">
            <h2 className="font-bold text-ink-900 mb-1 flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary-800" /> Promo Code
            </h2>
            <p className="text-sm text-ink-500 mb-4">Apply a discount code to save on your booking.</p>

            {promoDiscount > 0 ? (
              <div className="flex items-center justify-between bg-success-50 text-success-700 rounded-xl px-4 py-3">
                <span className="text-sm font-semibold">
                  {promoCode} — {promoDiscount}% off applied
                </span>
                <button onClick={handleRemovePromo} className="text-success-700 hover:text-error-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="e.g. DRIVE15"
                  className="form-field flex-1"
                />
                <button onClick={handleApplyPromo} className="btn btn-primary">Apply</button>
              </div>
            )}
            {promoError && <p className="text-xs text-error-600 mt-2">{promoError}</p>}
            <p className="text-xs text-ink-400 mt-3">Try: DRIVE15, WELCOME10, SUMMER5</p>
          </section>

          {/* Nav buttons */}
          <div className="flex items-center justify-between gap-3">
            <Link to={`/booking/${car.id}`} className="btn btn-secondary">
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
            <button onClick={handleNext} className="btn btn-primary btn-lg">
              Next: Payment <ArrowRight className="h-5 w-5" />
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
