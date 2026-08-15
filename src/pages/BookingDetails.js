import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Check, ArrowRight, ArrowLeft, Shield } from "lucide-react";
import BookingSteps from "../components/BookingSteps";
import BookingSummary from "../components/BookingSummary";
import Loading from "../components/Loading";
import { useBooking, PROTECTION_PLANS } from "../context/BookingContext";
import { pickupLocations } from "../data/cars";
import carService from "../services/carService";
import { formatPrice, minDate } from "../utils/format";

export default function BookingDetails() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { car, pickupLocation, returnLocation, pickupDate, returnDate, protection, summary, setCar, update } = useBooking();
  const [loading, setLoading] = useState(!car);

  useEffect(() => {
    if (!car && carId) {
      carService.getById(carId).then((c) => {
        setCar(c);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [carId, car, setCar]);

  if (loading) return <Loading />;
  if (!car) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink-500">Car not found.</p>
        <Link to="/cars" className="btn btn-primary btn-sm mt-4">Back to Fleet</Link>
      </div>
    );
  }

  if (summary.days === 0) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink-500">Please select valid dates to continue booking.</p>
        <Link to={`/cars/${car.id}`} className="btn btn-primary btn-sm mt-4">Back to Car</Link>
      </div>
    );
  }

  const handleNext = () => {
    navigate(`/booking/${car.id}/addons`);
  };

  return (
    <div className="container-page py-8 max-w-5xl">
      <BookingSteps current={1} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          {/* Trip Details */}
          <section className="card p-5 sm:p-6">
            <h2 className="font-bold text-ink-900 mb-1">Trip Details</h2>
            <p className="text-sm text-ink-500 mb-5">Review and edit your pickup and return information.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Pickup Location</label>
                <select value={pickupLocation} onChange={(e) => update({ pickupLocation: e.target.value })} className="form-field">
                  {pickupLocations.map((loc) => <option key={loc}>{loc}</option>)}
                </select>
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Return Location</label>
                <select value={returnLocation} onChange={(e) => update({ returnLocation: e.target.value })} className="form-field">
                  {pickupLocations.map((loc) => <option key={loc}>{loc}</option>)}
                </select>
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Pickup Date</label>
                <input type="date" min={minDate()} value={pickupDate} onChange={(e) => update({ pickupDate: e.target.value })} className="form-field" />
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Return Date</label>
                <input type="date" min={pickupDate} value={returnDate} onChange={(e) => update({ returnDate: e.target.value })} className="form-field" />
                {returnDate && returnDate < pickupDate && (
                  <p className="text-xs text-error-600 mt-1">Return date must be after pickup date.</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm bg-primary-50 text-primary-800 rounded-xl px-4 py-3">
              <Clock className="h-4 w-4" />
              <span>Rental duration: <strong>{summary.days} day{summary.days !== 1 ? "s" : ""}</strong></span>
            </div>
          </section>

          {/* Protection */}
          <section className="card p-5 sm:p-6">
            <h2 className="font-bold text-ink-900 mb-1 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-800" /> Protection Plans
            </h2>
            <p className="text-sm text-ink-500 mb-5">Choose the coverage that gives you peace of mind. One plan per booking.</p>

            <div className="space-y-3">
              {PROTECTION_PLANS.map((plan) => {
                const selected = protection === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => update({ protection: plan.id })}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                      selected ? "border-primary-800 bg-primary-50/50" : "border-ink-200 hover:border-primary-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className={`h-5 w-5 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selected ? "border-primary-800 bg-primary-800" : "border-ink-300"
                        }`}>
                          {selected && <Check className="h-3 w-3 text-white" />}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-ink-900">{plan.name}</p>
                            {plan.recommended && (
                              <span className="badge bg-primary-800 text-white">Recommended</span>
                            )}
                          </div>
                          <p className="text-sm text-ink-500 mt-1">{plan.description}</p>
                          <ul className="mt-2 space-y-1">
                            {plan.features.map((f) => (
                              <li key={f} className="text-xs text-ink-600 flex items-center gap-1.5">
                                <Check className="h-3 w-3 text-success-500" /> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {plan.dailyPrice === 0 ? (
                          <p className="font-bold text-success-600">Included</p>
                        ) : (
                          <>
                            <p className="font-extrabold text-ink-900">{formatPrice(plan.dailyPrice)}</p>
                            <p className="text-xs text-ink-500">/day</p>
                          </>
                        )}
                        <p className="text-xs text-ink-500 mt-1">Deductible: {plan.deductible}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Nav buttons */}
          <div className="flex items-center justify-between gap-3">
            <Link to={`/cars/${car.id}`} className="btn btn-secondary">
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
            <button onClick={handleNext} className="btn btn-primary btn-lg">
              Next: Add-ons <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 self-start">
          <BookingSummary car={car} summary={summary} protectionPlan={summary.protectionPlan} compact />
        </aside>
      </div>
    </div>
  );
}
