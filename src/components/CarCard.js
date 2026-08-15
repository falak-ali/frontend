import { Link } from "react-router-dom";
import { Star, Users, Fuel, Settings, ArrowRight } from "lucide-react";
import { formatPrice } from "../utils/format";

export default function CarCard({ car }) {
  return (
    <div className="card group overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        <img
          src={car.images?.[0]}
          alt={car.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 badge bg-white/95 text-primary-800 shadow-soft">
          {car.category}
        </span>
        {!car.available && (
          <span className="absolute top-3 right-3 badge bg-error text-white">Unavailable</span>
        )}
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
            <p className="text-xs text-ink-500">From</p>
            <p className="text-xl font-extrabold text-ink-900">
              {formatPrice(car.pricePerDay)}
              <span className="text-xs font-medium text-ink-500"> /day</span>
            </p>
          </div>
          <Link
            to={car.available ? `/cars/${car.id}` : "#"}
            className={`btn btn-primary btn-sm ${!car.available ? "opacity-50 pointer-events-none" : ""}`}
          >
            Book Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
