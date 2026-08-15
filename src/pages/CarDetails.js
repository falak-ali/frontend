import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Star, ChevronRight, MapPin, Calendar, CheckCircle2, ArrowRight,
} from "lucide-react";
import CarGallery from "../components/CarGallery";
import CarSpecifications from "../components/CarSpecifications";
import FeatureList from "../components/FeatureList";
import ReviewCard from "../components/ReviewCard";
import Loading from "../components/Loading";
import { useBooking } from "../context/BookingContext";
import { sampleReviews, pickupLocations } from "../data/cars";
import carService from "../services/carService";
import { formatPrice, minDate, daysBetween } from "../utils/format";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCar, update, pickupLocation } = useBooking();
  const [car, setCarState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState(minDate());
  const [returnDate, setReturnDate] = useState(minDate());

  useEffect(() => {
    setLoading(true);
    carService.getById(id).then(setCarState).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!car) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink-500">Car not found.</p>
        <Link to="/cars" className="btn btn-primary btn-sm mt-4">Back to Fleet</Link>
      </div>
    );
  }

  const days = daysBetween(pickupDate, returnDate);
  const baseRental = car.pricePerDay * days;
  const serviceFee = days > 0 ? 5 : 0;
  const total = baseRental + serviceFee;

  const handleBook = () => {
    setCar(car);
    update({ pickupDate, returnDate });
    navigate(`/booking/${car.id}`);
  };

  return (
    <div className="container-page py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-ink-500 mb-5 flex-wrap">
        <Link to="/" className="hover:text-ink-900">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/cars" className="hover:text-ink-900">Fleet</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink-900 font-medium truncate">{car.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* LEFT — gallery + details */}
        <div className="space-y-8">
          <div>
            <span className="badge bg-primary-100 text-primary-800 mb-3">{car.category}</span>
            <CarGallery images={car.images} name={car.name} />
          </div>

          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">{car.name}</h1>
                <p className="text-ink-500 text-sm mt-1">{car.brand} · {car.year}</p>
              </div>
              <div className="flex items-center gap-2 bg-primary-50 text-primary-800 px-3 py-2 rounded-xl">
                <Star className="h-5 w-5 fill-current" />
                <div>
                  <p className="font-bold leading-none">{car.rating}</p>
                  <p className="text-xs text-primary-700 mt-0.5">{car.reviews} reviews</p>
                </div>
              </div>
            </div>

            <p className="text-ink-600 leading-relaxed mt-5">{car.description}</p>
          </div>

          {/* Specs */}
          <div>
            <h2 className="text-lg font-bold text-ink-900 mb-4">Key Specifications</h2>
            <CarSpecifications car={car} />
          </div>

          {/* Features */}
          <div>
            <h2 className="text-lg font-bold text-ink-900 mb-4">Premium Features</h2>
            <FeatureList features={car.features} />
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-bold text-ink-900 mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              {sampleReviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — booking card */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="card p-5 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-ink-500">Starting from</p>
                <p className="text-2xl font-extrabold text-primary-800">
                  {formatPrice(car.pricePerDay)}
                  <span className="text-sm font-medium text-ink-500"> /day</span>
                </p>
              </div>
              <span className={`badge ${car.available ? "bg-success-100 text-success-700" : "bg-error-100 text-error-700"}`}>
                {car.available ? "Available" : "Unavailable"}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="label flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Pickup Date
                </label>
                <input
                  type="date"
                  min={minDate()}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="form-field"
                />
              </div>
              <div>
                <label className="label flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Return Date
                </label>
                <input
                  type="date"
                  min={pickupDate}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="form-field"
                />
              </div>
              <div>
                <label className="label flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Pickup Location
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => update({ pickupLocation: e.target.value })}
                  className="form-field"
                >
                  {pickupLocations.map((loc) => <option key={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            {/* Price calc */}
            <div className="border-t border-ink-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Base rental ({days} day{days !== 1 ? "s" : ""})</span>
                <span className="font-semibold">{formatPrice(baseRental)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Service fee</span>
                <span className="font-semibold">{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between items-end pt-2 border-t border-ink-100">
                <span className="font-bold text-ink-900">Total</span>
                <span className="text-xl font-extrabold text-primary-800">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={!car.available || days === 0}
              className="btn btn-primary w-full btn-lg"
            >
              {car.available ? "Book This Car" : "Currently Unavailable"}
              {car.available && <ArrowRight className="h-5 w-5" />}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-ink-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-success-500" />
              Free cancellation up to 48h before pickup
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
