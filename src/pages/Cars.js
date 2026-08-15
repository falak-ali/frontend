import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Search, X, MapPin, Calendar } from "lucide-react";
import CarCard from "../components/CarCard";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import carService from "../services/carService";
import { categories, transmissions, fuelTypes } from "../data/cars";

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const PER_PAGE = 6;

function CarCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-ink-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 bg-ink-100 rounded" />
        <div className="h-5 w-40 bg-ink-100 rounded" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-3 bg-ink-100 rounded" />
          <div className="h-3 bg-ink-100 rounded" />
          <div className="h-3 bg-ink-100 rounded" />
        </div>
        <div className="h-8 w-full bg-ink-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function Cars() {
  const [params] = useSearchParams();
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: params.get("category") || "All",
    location: params.get("location") || "All",
    pickupDate: params.get("pickup") || "",
    returnDate: params.get("return") || "",
    minPrice: 0,
    maxPrice: 400,
    seats: "Any",
    transmission: "Any",
    fuelType: "Any",
    availability: "Any",
  });

  useEffect(() => {
    let active = true;
    carService.getAll().then((cars) => {
      if (active) {
        setAllCars(cars);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const updateFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...allCars];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q)
      );
    }

    if (filters.category !== "All") {
      result = result.filter((c) => c.category === filters.category);
    }
    if (filters.location !== "All") {
      result = result.filter(
        (c) => c.locations && c.locations.includes(filters.location)
      );
    }
    if (filters.transmission !== "Any") {
      result = result.filter((c) => c.transmission === filters.transmission);
    }
    if (filters.fuelType !== "Any") {
      result = result.filter((c) => c.fuelType === filters.fuelType);
    }
    if (filters.seats !== "Any") {
      const seats = parseInt(filters.seats, 10);
      result = result.filter((c) => c.seats >= seats);
    }
    if (filters.availability !== "Any") {
      const available = filters.availability === "Available";
      result = result.filter((c) => c.available === available);
    }

    result = result.filter(
      (c) => c.pricePerDay >= filters.minPrice && c.pricePerDay <= filters.maxPrice
    );

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "price-high":
        result.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
    }

    return result;
  }, [allCars, query, filters, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearAll = () => {
    setFilters({
      category: "All", location: "All", pickupDate: "", returnDate: "",
      minPrice: 0, maxPrice: 400,
      seats: "Any", transmission: "Any", fuelType: "Any", availability: "Any",
    });
    setQuery("");
    setSort("recommended");
    setPage(1);
  };

  const activeFilterCount = [
    filters.category !== "All",
    filters.location !== "All",
    filters.transmission !== "Any",
    filters.fuelType !== "Any",
    filters.seats !== "Any",
    filters.availability !== "Any",
    filters.minPrice > 0 || filters.maxPrice < 400,
  ].filter(Boolean).length;

  const searchSummary = (filters.location !== "All" || filters.pickupDate || filters.returnDate);

  const FiltersPanel = (
    <div className="space-y-5">
      {searchSummary && (
        <FilterGroup label="Your Search">
          <div className="space-y-2 text-xs text-ink-600">
            {filters.location !== "All" && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary-800" /> {filters.location}
              </div>
            )}
            {filters.pickupDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary-800" /> Pickup: {filters.pickupDate}
              </div>
            )}
            {filters.returnDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary-800" /> Return: {filters.returnDate}
              </div>
            )}
            <button onClick={() => { updateFilter("location", "All"); updateFilter("pickupDate", ""); updateFilter("returnDate", ""); }} className="text-error-600 font-medium hover:underline mt-1">
              Clear search
            </button>
          </div>
        </FilterGroup>
      )}

      <FilterGroup label="Price Range">
        <div className="flex items-center gap-2">
          <input
            type="number" min="0" max="400" value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", Number(e.target.value))}
            className="form-field"
            placeholder="Min"
          />
          <span className="text-ink-400">—</span>
          <input
            type="number" min="0" max="400" value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", Number(e.target.value))}
            className="form-field"
            placeholder="Max"
          />
        </div>
      </FilterGroup>

      <FilterGroup label="Car Type">
        <div className="flex flex-wrap gap-2">
          <Chip active={filters.category === "All"} onClick={() => updateFilter("category", "All")}>All</Chip>
          {categories.map((c) => (
            <Chip key={c} active={filters.category === c} onClick={() => updateFilter("category", c)}>{c}</Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Seats">
        <div className="flex flex-wrap gap-2">
          {["Any", "2", "4", "5", "7"].map((s) => (
            <Chip key={s} active={filters.seats === s} onClick={() => updateFilter("seats", s)}>
              {s === "Any" ? "Any" : `${s}+`}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Transmission">
        <div className="flex flex-wrap gap-2">
          <Chip active={filters.transmission === "Any"} onClick={() => updateFilter("transmission", "Any")}>Any</Chip>
          {transmissions.map((t) => (
            <Chip key={t} active={filters.transmission === t} onClick={() => updateFilter("transmission", t)}>{t}</Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Fuel Type">
        <div className="flex flex-wrap gap-2">
          <Chip active={filters.fuelType === "Any"} onClick={() => updateFilter("fuelType", "Any")}>Any</Chip>
          {fuelTypes.map((f) => (
            <Chip key={f} active={filters.fuelType === f} onClick={() => updateFilter("fuelType", f)}>{f}</Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Availability">
        <div className="flex flex-wrap gap-2">
          {["Any", "Available", "Unavailable"].map((a) => (
            <Chip key={a} active={filters.availability === a} onClick={() => updateFilter("availability", a)}>{a}</Chip>
          ))}
        </div>
      </FilterGroup>

      {activeFilterCount > 0 && (
        <button onClick={clearAll} className="btn btn-ghost btn-sm w-full text-error">
          <X className="h-4 w-4" /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">Available Vehicles</h1>
        <p className="text-ink-500 mt-1.5 text-sm">
          {loading ? "Loading vehicles…" : `${filtered.length} car${filtered.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Search + Sort bar */}
      <div className="card p-3 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-ink-400" />
          <input
            type="text"
            placeholder="Search by car name or brand…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="form-field pl-10"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="form-field sm:w-56"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          onClick={() => setShowFilters(true)}
          className="btn btn-secondary lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {activeFilterCount > 0 && (
            <span className="badge bg-primary-800 text-white ml-1">{activeFilterCount}</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="card p-5 sticky top-24">
            <h3 className="font-bold text-ink-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h3>
            {FiltersPanel}
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-lift overflow-y-auto animate-fade-in p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-ink-900">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1.5 rounded-lg hover:bg-ink-50">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {FiltersPanel}
              <button onClick={() => setShowFilters(false)} className="btn btn-primary w-full mt-5">
                Show {filtered.length} results
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <CarCardSkeleton key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <EmptyState
              title="No cars match your filters"
              description="Try adjusting your search criteria or clearing some filters."
              action={
                <button onClick={clearAll} className="btn btn-primary btn-sm">
                  Clear filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginated.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink-700 mb-2">{label}</p>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
        active
          ? "bg-primary-800 text-white border-primary-800"
          : "bg-white text-ink-600 border-ink-200 hover:border-primary-300"
      }`}
    >
      {children}
    </button>
  );
}
