import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, X, Loader2 } from "lucide-react";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import { cars as initialCars, categories, transmissions, fuelTypes } from "../data/cars";
import carService from "../services/carService";
import { formatPrice } from "../utils/format";

const emptyForm = {
  name: "", brand: "", model: "", year: 2024, category: "Economy",
  pricePerDay: 50, seats: 5, transmission: "Automatic", fuelType: "Regular Unleaded",
  engine: "", acceleration: "", storage: "", rating: 4.5, reviews: 0,
  available: true, images: [], features: [], description: "",
};

export default function AdminCars() {
  const [cars, setCars] = useState(initialCars);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const filtered = cars.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.brand.toLowerCase().includes(query.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageUrl("");
    setModalOpen(true);
  };

  const openEdit = (car) => {
    setEditing(car);
    setForm({ ...car });
    setImageUrl(car.images?.[0] || "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand) return;
    setSaving(true);
    const images = form.images?.length ? form.images : imageUrl ? [imageUrl] : ["https://images.pexels.com/photos/27692895/pexels-photo-27692895.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"];
    const payload = { ...form, images, year: Number(form.year), pricePerDay: Number(form.pricePerDay), seats: Number(form.seats), rating: Number(form.rating), reviews: Number(form.reviews) };

    if (editing) {
      const updated = await carService.update(editing.id, payload);
      setCars((c) => c.map((car) => (car.id === editing.id ? { ...updated, id: editing.id } : car)));
    } else {
      const created = await carService.create(payload);
      setCars((c) => [created, ...c]);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car? This cannot be undone.")) return;
    await carService.remove(id);
    setCars((c) => c.filter((car) => car.id !== id));
  };

  const toggleAvailability = (id) => {
    setCars((c) => c.map((car) => (car.id === id ? { ...car, available: !car.available } : car)));
  };

  const addImageUrl = () => {
    if (imageUrl) {
      setForm({ ...form, images: [...(form.images || []), imageUrl] });
      setImageUrl("");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Manage Cars</h1>
          <p className="text-ink-500 text-sm mt-1">{cars.length} vehicles in fleet</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus className="h-4.5 w-4.5" /> Add Car
        </button>
      </div>

      <div className="relative mt-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-ink-400" />
        <input
          type="text"
          placeholder="Search cars…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-field pl-10 max-w-md"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No cars found" description="Try a different search or add a new car." />
      ) : (
        <div className="mt-5 card divide-y divide-ink-100">
          {filtered.map((car) => (
            <div key={car.id} className="flex items-center gap-4 p-4">
              <img src={car.images?.[0]} alt={car.name} className="h-14 w-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-900 text-sm truncate">{car.name}</p>
                <p className="text-xs text-ink-500">{car.category} · {formatPrice(car.pricePerDay)}/day · {car.seats} seats</p>
              </div>
              <button
                onClick={() => toggleAvailability(car.id)}
                className={`badge cursor-pointer ${car.available ? "bg-success-100 text-success-700" : "bg-error-100 text-error-700"}`}
              >
                {car.available ? "Available" : "Unavailable"}
              </button>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(car)} className="btn btn-ghost btn-sm" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(car.id)} className="btn btn-ghost btn-sm text-error-600" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Car" : "Add New Car"}
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving || !form.name} className="btn btn-primary">
              {saving ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "Save"}
            </button>
          </div>
        }
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-field" /></FormField>
            <FormField label="Brand"><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="form-field" /></FormField>
            <FormField label="Year"><input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="form-field" /></FormField>
            <FormField label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-field">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Price/Day ($)"><input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} className="form-field" /></FormField>
            <FormField label="Seats"><input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className="form-field" /></FormField>
            <FormField label="Transmission">
              <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className="form-field">
                {transmissions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Fuel Type">
              <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })} className="form-field">
                {fuelTypes.map((f) => <option key={f}>{f}</option>)}
              </select>
            </FormField>
            <FormField label="Engine"><input value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value })} className="form-field" placeholder="3.0L Twin-Turbo" /></FormField>
            <FormField label="0-100 KM/H"><input value={form.acceleration} onChange={(e) => setForm({ ...form, acceleration: e.target.value })} className="form-field" placeholder="3.8 Seconds" /></FormField>
            <FormField label="Storage"><input value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} className="form-field" placeholder="2 Large Bags" /></FormField>
            <FormField label="Rating"><input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="form-field" /></FormField>
          </div>

          <FormField label="Description">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-field min-h-[60px] resize-none" />
          </FormField>

          <FormField label="Features (comma-separated)">
            <input
              value={Array.isArray(form.features) ? form.features.join(", ") : form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value.split(",").map((f) => f.trim()).filter(Boolean) })}
              className="form-field"
              placeholder="Climate Control, GPS Navigation, Bluetooth"
            />
          </FormField>

          <FormField label="Image URL">
            <div className="flex gap-2">
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="form-field" placeholder="https://…" />
              <button onClick={addImageUrl} className="btn btn-secondary"><Plus className="h-4 w-4" /></button>
            </div>
          </FormField>

          {form.images?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {form.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt={`Preview ${i}`} className="h-16 w-24 rounded-lg object-cover" />
                  <button
                    onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-error text-white flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-ink-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
              className="h-4 w-4 rounded border-ink-300 text-primary-800"
            />
            Available for booking
          </label>
        </div>
      </Modal>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="label text-xs">{label}</label>
      {children}
    </div>
  );
}
