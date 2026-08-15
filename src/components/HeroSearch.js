import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CalendarDays, CarType, Search } from "../utils/icons";
import { categories, pickupLocations } from "../data/cars";
import { minDate } from "../utils/format";

const locations = pickupLocations;

export default function HeroSearch() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location: "Karachi — Airport",
    pickupDate: minDate(),
    returnDate: minDate(),
    carType: "All",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.location) params.set("location", form.location);
    if (form.pickupDate) params.set("pickup", form.pickupDate);
    if (form.returnDate) params.set("return", form.returnDate);
    if (form.carType && form.carType !== "All") params.set("category", form.carType);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="card p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-0 lg:divide-x lg:divide-ink-100"
    >
      <Field label="Location" icon={MapPin}>
        <select name="location" value={form.location} onChange={handleChange} className="form-field">
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </Field>

      <Field label="Pickup Date" icon={CalendarDays}>
        <input type="date" name="pickupDate" min={minDate()} value={form.pickupDate} onChange={handleChange} className="form-field" />
      </Field>

      <Field label="Return Date" icon={CalendarDays}>
        <input type="date" name="returnDate" min={form.pickupDate} value={form.returnDate} onChange={handleChange} className="form-field" />
      </Field>

      <Field label="Car Type" icon={CarType}>
        <select name="carType" value={form.carType} onChange={handleChange} className="form-field">
          <option value="All">All Types</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Field>

      <div className="lg:col-span-4 mt-1">
        <button type="submit" className="btn btn-primary w-full btn-lg">
          <Search className="h-5 w-5" /> Search Available Vehicles
        </button>
      </div>
    </form>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-1.5 lg:px-4">
      <label className="text-xs font-semibold text-ink-500 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" /> {label}
      </label>
      {children}
    </div>
  );
}
