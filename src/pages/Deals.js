import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, Percent, ArrowRight, Star, Users, Settings, Fuel, Clock, TrendingDown, Calendar, MapPin, X } from "lucide-react";
import carService from "../services/carService";
import { formatPrice, minDate, daysBetween } from "../utils/format";
import { pickupLocations } from "../data/cars";
import { useBooking } from "../context/BookingContext";
import EmptyState from "../components/EmptyState";

const ACTIVE_PROMOS = [
  { code: "DRIVE15", discount: 15, label: "15% off any booking", desc: "Valid on all vehicles, no minimum spend.", badge: "Best Value" },
  { code: "WELCOME10", discount: 10, label: "10% off your first rental", desc: "New to DriveEasy? Take 10% off your maiden trip.", badge: "New Users" },
  { code: "SUMMER5", discount: 5, label: "5% off summer trips", desc: "Limited-time summer savings on every car.", badge: "Seasonal" },
];

function discountTier(price) {
  if (price <= 60) return { pct: 20, label: "20% OFF" };
  if (price <= 100) return { pct: 15, label: "15% OFF" };
  if (price <= 200) return { pct: 10, label: "10% OFF" };
  return { pct: 5, label: "5% OFF" };
}

const todayISO = () => new Date().toISOString().split("T")[0];
const plusDaysISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

export default function Deals() {
  const navigate = useNavigate();
  const { setCar, update } = useBooking();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingCar, setBookingCar] = useState(null);

  useEffect(() => {
    let active = true;
    carService.getAll().then((all) => {
      if (active) {
        setCars(all);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const dealCars = cars
    .filter((c) => c.available)
    .map((c) => {
      const tier = discountTier(c.pricePerDay);
      const discountedPrice = Math.round(c.pricePerDay * (1 - tier.pct / 100));
      return { ...c, discountPct: tier.pct, discountLabel: tier.label, discountedPrice };
    })
    .sort((a, b) => b.discountPct - a.discountPct);

  const handleStartBooking = (car) => {
    setCar(car);
    update({
      pickupLocation: pickupLocations[0],
      returnLocation: pickupLocations[0],
      pickupDate: todayISO(),
      returnDate: plusDaysISO(3),
      protection: "basic",
      addons: {},
      promoCode: "",
      promoDiscount: 0,
    });
    setBookingCar(car);
  };

  return (
    <div className="container-page py-8">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white p-8 sm:p-12 mb-8">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold mb-4">
            <Percent className="h-3.5 w-3.5" /> Limited Time Offers
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Exclusive Deals & Discounts
          </h1>
          <p className="text-white/80 mt-3 text-sm sm:text-base leading-relaxed">
            Save up to 20% on select vehicles plus stack promo codes at checkout for even bigger savings.
          </p>
        </div>
        <TrendingDown className="absolute -right-4 -bottom-4 h-48 w-48 text-white/10" />
      </div>

      {/* Promo codes */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-ink-900 mb-1 flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary-800" /> Active Promo Codes
        </h2>
        <p className="text-sm text-ink-500 mb-4">Copy a code and paste it at the add-ons step to apply your discount.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ACTIVE_PROMOS.map((promo) => (
            <div key={promo.code} className="card p-5 relative overflow-hidden">
              {promo.badge && (
                <span className="absolute top-0 right-0 bg-primary-800 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  {promo.badge}
                </span>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl font-extrabold text-primary-800">{promo.discount}%</span>
                <span className="text-xs text-ink-400 font-medium">OFF</span>
              </div>
              <p className="font-semibold text-ink-900 text-sm">{promo.label}</p>
              <p className="text-xs text-ink-500 mt-1">{promo.desc}</p>
              <div className="mt-3 flex items-center gap-2 bg-ink-50 rounded-lg px-3 py-2 border-2 border-dashed border-ink-200">
                <span className="font-mono font-bold text-sm text-ink-900 flex-1">{promo.code}</span>
                <button
                  onClick={() => navigator.clipboard?.writeText(promo.code)}
                  className="text-xs font-medium text-primary-800 hover:text-primary-900 transition"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discounted cars */}
      <section>
        <h2 className="text-xl font-bold text-ink-900 mb-1">Discounted Vehicles</h2>
        <p className="text-sm text-ink-500 mb-5">
          {loading ? "Loading deals…" : `${dealCars.length} cars on sale`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-ink-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-20 bg-ink-100 rounded" />
                  <div className="h-5 w-40 bg-ink-100 rounded" />
                  <div className="h-8 w-full bg-ink-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : dealCars.length === 0 ? (
          <EmptyState icon={Tag} title="No deals available" description="Check back soon for new offers and discounts." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {dealCars.map((car) => (
              <DealCarCard key={car.id} car={car} onBook={() => handleStartBooking(car)} />
            ))}
          </div>
        )}
      </section>

      {bookingCar && (
        <QuickBookingModal car={bookingCar} onClose={() => setBookingCar(null)} onConfirm={() => navigate(`/booking/${bookingCar.id}`)} />
      )}
    </div>
  );
}

function DealCarCard({ car, onBook }) {
  return (
    <div className="card group overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        <img
          src={car.images?.[0]}
          alt={car.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 badge bg-error text-white shadow-soft">
          {car.discountLabel}
        </span>
        <span className="absolute top-3 right-3 badge bg-white/95 text-primary-800 shadow-soft">
          {car.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-ink-900 text-base leading-snug">{car.name}</h3>
            <p className="text-xs text-ink-500 mt-0.5">{car.brand} · {car.year}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-primary-50 text-primary-800 px-2 py-1 rounded-lg">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-bold">{car.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-ink-600">
          <div className="flex flex-col items-center gap-1 bg-ink-50 rounded-lg py-2">
            <Users className="h-4 w-4 text-ink-500" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-ink-50 rounded-lg py-2">
            <Settings className="h-4 w-4 text-ink-500" />
            <span className="truncate">{car.transmission}</span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-ink-50 rounded-lg py-2">
            <Fuel className="h-4 w-4 text-ink-500" />
            <span className="truncate">{car.fuelType}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-ink-100 flex items-end justify-between">
          <div>
            <p className="text-xs text-ink-400 line-through">{formatPrice(car.pricePerDay)}/day</p>
            <p className="text-xl font-extrabold text-error-600">
              {formatPrice(car.discountedPrice)}
              <span className="text-xs font-medium text-ink-500"> /day</span>
            </p>
            <p className="text-xs text-success-600 font-medium mt-0.5 flex items-center gap-1">
              <Clock className="h-3 w-3" /> You save {formatPrice(car.pricePerDay - car.discountedPrice)}/day
            </p>
          </div>
          <button onClick={onBook} className="btn btn-primary btn-sm">
            Book Now <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickBookingModal({ car, onClose, onConfirm }) {
  const { update, pickupLocation, returnLocation, pickupDate, returnDate } = useBooking();
  const [form, setForm] = useState({
    pickupLocation,
    returnLocation,
    pickupDate: pickupDate || minDate(),
    returnDate: returnDate || plusDaysISO(3),
  });
  const [error, setError] = useState("");

  const days = useMemo(() => daysBetween(form.pickupDate, form.returnDate), [form.pickupDate, form.returnDate]);
  const baseRental = car.discountedPrice * days;
  const serviceFee = days > 0 ? 5 : 0;
  const total = baseRental + serviceFee;
  const originalTotal = car.pricePerDay * days + serviceFee;
  const savings = originalTotal - total;

  const handleField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const handleConfirm = () => {
    if (!form.pickupDate || !form.returnDate) {
      setError("Please select pickup and return dates.");
      return;
    }
    if (days === 0) {
      setError("Return date must be after the pickup date.");
      return;
    }
    update({
      pickupLocation: form.pickupLocation,
      returnLocation: form.returnLocation,
      pickupDate: form.pickupDate,
      returnDate: form.returnDate,
    });
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-lift w-full sm:max-w-lg max-h-[92vh] overflow-y-auto animate-fade-up">
        {/* Header with car image */}
        <div className="relative h-32 sm:h-36 overflow-hidden rounded-t-2xl">
          <img src={car.images?.[0]} alt={car.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 text-ink-700 hover:bg-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-4 text-white">
            <span className="badge bg-error text-white mb-1.5">{car.discountLabel}</span>
            <h3 className="font-bold text-lg leading-tight">{car.name}</h3>
            <p className="text-xs text-white/80">{car.brand} · {car.year}</p>
          </div>
        </div>

        {/* Form body */}
        <div className="p-5 space-y-4">
          <div>
            <h4 className="font-bold text-ink-900 text-sm mb-1">Quick Booking</h4>
            <p className="text-xs text-ink-500">Pick your dates and location, then continue to add-ons and payment.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Pickup Location</label>
              <select value={form.pickupLocation} onChange={(e) => handleField("pickupLocation", e.target.value)} className="form-field">
                {pickupLocations.map((loc) => <option key={loc}>{loc}</option>)}
              </select>
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Return Location</label>
              <select value={form.returnLocation} onChange={(e) => handleField("returnLocation", e.target.value)} className="form-field">
                {pickupLocations.map((loc) => <option key={loc}>{loc}</option>)}
              </select>
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Pickup Date</label>
              <input type="date" min={minDate()} value={form.pickupDate} onChange={(e) => handleField("pickupDate", e.target.value)} className="form-field" />
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Return Date</label>
              <input type="date" min={form.pickupDate || minDate()} value={form.returnDate} onChange={(e) => handleField("returnDate", e.target.value)} className="form-field" />
            </div>
          </div>

          {error && (
            <div className="text-xs text-error-600 bg-error/5 border border-error-200 rounded-lg px-3 py-2">{error}</div>
          )}

          {/* Price estimate */}
          <div className="bg-ink-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">Deal rate</span>
              <span className="font-semibold text-ink-900">
                {formatPrice(car.discountedPrice)}/day
                <span className="text-xs text-ink-400 line-through ml-1.5">{formatPrice(car.pricePerDay)}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">Duration</span>
              <span className="font-semibold text-ink-900">{days} day{days !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">Base rental</span>
              <span className="font-semibold text-ink-900">{formatPrice(baseRental)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">Service fee</span>
              <span className="font-semibold text-ink-900">{formatPrice(serviceFee)}</span>
            </div>
            {savings > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-success-600 font-medium flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> You save</span>
                <span className="font-semibold text-success-600">{formatPrice(savings)}</span>
              </div>
            )}
            <div className="border-t border-ink-200 pt-2 flex items-center justify-between">
              <span className="font-bold text-ink-900">Estimated total</span>
              <span className="text-xl font-extrabold text-primary-800">{formatPrice(total)}</span>
            </div>
          </div>

          <p className="text-xs text-ink-400">
            Add-ons, protection plans, and promo codes can be applied in the next steps.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-ink-100 bg-ink-50/50 flex items-center gap-3">
          <button onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
          <button onClick={handleConfirm} disabled={days === 0} className="btn btn-primary flex-1 btn-lg">
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
