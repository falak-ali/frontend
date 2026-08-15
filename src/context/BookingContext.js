import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Holds the in-progress booking as the user moves through the
// Details -> Add-ons -> Payment -> Confirmation flow.
const BookingContext = createContext(null);

export const PROTECTION_PLANS = [
  {
    id: "basic",
    name: "Basic",
    description: "Standard deductible coverage included with every rental.",
    dailyPrice: 0,
    deductible: "PKR 25,000",
    features: ["Third-party liability", "Basic damage cover", "Standard deductible"],
  },
  {
    id: "standard",
    name: "Standard",
    description: "Lower deductible with extended damage protection. Recommended for most trips.",
    dailyPrice: 8,
    deductible: "PKR 10,000",
    features: ["Lower deductible", "Theft protection", "Glass & tyre cover", "24/7 roadside"],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Zero deductible. Complete peace of mind with full comprehensive cover.",
    dailyPrice: 15,
    deductible: "PKR 0",
    features: ["Zero deductible", "Full comprehensive", "Theft & fire", "Personal accident cover"],
  },
];

export const ADDONS = [
  { id: "gps", name: "GPS Navigation", description: "Live turn-by-turn navigation system.", dailyPrice: 3, icon: "Navigation" },
  { id: "childSeat", name: "Child Seat", description: "Certified child safety seat.", dailyPrice: 4, icon: "Baby" },
  { id: "additionalDriver", name: "Additional Driver", description: "Register a second driver at no risk.", dailyPrice: 6, icon: "Users" },
  { id: "wifi", name: "Wi-Fi Hotspot", description: "Unlimited in-car 4G Wi-Fi hotspot.", dailyPrice: 5, icon: "Wifi" },
];

const SERVICE_FEE = 5;

const todayISO = () => new Date().toISOString().split("T")[0];
const plusDaysISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const defaultState = {
  car: null,
  pickupLocation: "Karachi — Airport",
  returnLocation: "Karachi — Airport",
  pickupDate: todayISO(),
  returnDate: plusDaysISO(3),
  protection: "basic",
  addons: {},
  customer: { fullName: "", email: "", phone: "" },
  payment: { cardNumber: "", expiry: "", cvv: "", billingAddress: "" },
  promoCode: "",
  promoDiscount: 0,
  confirmedBooking: null,
};

export function BookingProvider({ children }) {
  const [state, setState] = useState(defaultState);

  const setCar = (car) => setState((s) => ({ ...s, car }));

  const update = (patch) => setState((s) => ({ ...s, ...patch }));

  const toggleAddon = (id) =>
    setState((s) => ({
      ...s,
      addons: { ...s.addons, [id]: !s.addons[id] },
    }));

  const reset = () => setState(defaultState);

  // Derived values
  const days = useMemo(() => {
    if (!state.pickupDate || !state.returnDate) return 0;
    const a = new Date(state.pickupDate);
    const b = new Date(state.returnDate);
    const diff = Math.round((b - a) / 86400000);
    return Math.max(diff, 0);
  }, [state.pickupDate, state.returnDate]);

  const baseRental = useMemo(
    () => (state.car ? state.car.pricePerDay * days : 0),
    [state.car, days]
  );

  const protectionPlan = useMemo(
    () => PROTECTION_PLANS.find((p) => p.id === state.protection) || PROTECTION_PLANS[0],
    [state.protection]
  );

  const protectionCost = useMemo(
    () => protectionPlan.dailyPrice * days,
    [protectionPlan, days]
  );

  const addonsCost = useMemo(() => {
    return ADDONS.reduce((sum, a) => {
      return sum + (state.addons[a.id] ? a.dailyPrice * days : 0);
    }, 0);
  }, [state.addons, days]);

  const subtotal = baseRental + protectionCost + addonsCost;
  const serviceFee = days > 0 ? SERVICE_FEE : 0;
  const discount = Math.round((subtotal * (state.promoDiscount || 0)) / 100);
  const total = Math.max(subtotal + serviceFee - discount, 0);

  const summary = {
    days,
    baseRental,
    protectionCost,
    addonsCost,
    serviceFee,
    discount,
    total,
    protectionPlan,
  };

  const value = {
    ...state,
    summary,
    setCar,
    update,
    toggleAddon,
    reset,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

export default BookingContext;
