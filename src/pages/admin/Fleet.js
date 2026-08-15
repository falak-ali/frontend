import { useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, Car, CheckCircle2, Wrench, TrendingUp } from "lucide-react";
import AdminModal from "../../components/admin/AdminModal";
import StatCard from "../../components/admin/StatCard";
import { adminFleet } from "../../data/adminData";
import { formatPrice } from "../../utils/format";

const emptyForm = {
  name: "", brand: "", category: "Economy", pricePerDay: 50, seats: 5,
  transmission: "Automatic", fuelType: "Regular Unleaded", status: "available", image: "",
};

const categories = ["Economy", "Premium", "Luxury", "Sports", "SUV", "Electric"];
const statuses = ["available", "rented", "maintenance"];

export default function Fleet() {
  const [fleet, setFleet] = useState(adminFleet);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return fleet.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q);
      }
      return true;
    });
  }, [fleet, query, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = {
    total: fleet.length,
    available: fleet.filter((c) => c.status === "available").length,
    rented: fleet.filter((c) => c.status === "rented").length,
    maintenance: fleet.filter((c) => c.status === "maintenance").length,
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (car) => {
    setEditing(car);
    setForm({ ...car, image: car.image || "" });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.brand) return;
    if (editing) {
      setFleet((f) => f.map((c) => (c.id === editing.id ? { ...form, id: editing.id, image: form.image || editing.image, rating: editing.rating, bookings: editing.bookings } : c)));
    } else {
      setFleet((f) => [{ ...form, id: `car_${Date.now()}`, image: form.image || "https://images.pexels.com/photos/27692895/pexels-photo-27692895.jpeg?auto=compress&cs=tinysrgb&h=120&w=180", rating: 4.5, bookings: 0 }, ...f]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this vehicle? This cannot be undone.")) return;
    setFleet((f) => f.filter((c) => c.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setFleet((f) => f.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const columns = [
    {
      key: "name", label: "Vehicle", sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <img src={c.image} alt={c.name} className="h-10 w-14 rounded-lg object-cover shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-ink-900 truncate">{c.name}</p>
            <p className="text-xs text-ink-500">{c.brand} · {c.category}</p>
          </div>
        </div>
      ),
    },
    { key: "seats", label: "Seats", render: (c) => <span className="text-ink-600">{c.seats} seats</span> },
    { key: "transmission", label: "Trans.", render: (c) => <span className="text-ink-600">{c.transmission}</span> },
    {
      key: "pricePerDay", label: "Price/Day", sortable: true,
      render: (c) => <span className="font-semibold text-ink-900">{formatPrice(c.pricePerDay)}</span>,
    },
    { key: "bookings", label: "Bookings", sortable: true, render: (c) => <span className="text-ink-600">{c.bookings}</span> },
    {
      key: "status", label: "Status",
      render: (c) => (
        <select
          value={c.status}
          onChange={(e) => handleStatusChange(c.id, e.target.value)}
          className="text-xs font-semibold border-0 bg-transparent cursor-pointer capitalize focus:outline-none"
          style={{ color: c.status === "available" ? "#059669" : c.status === "rented" ? "#063B9F" : "#d97706" }}
        >
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
    },
    {
      key: "actions", label: "",
      render: (c) => (
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-100 hover:text-primary-600">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-ink-500 hover:bg-error-50 hover:text-error-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Fleet" value={stats.total} icon={Car} color="primary" />
        <StatCard label="Available" value={stats.available} icon={CheckCircle2} color="success" />
        <StatCard label="Rented" value={stats.rented} icon={TrendingUp} color="primary" />
        <StatCard label="Maintenance" value={stats.maintenance} icon={Wrench} color="warning" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input type="text" placeholder="Search vehicles…" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="form-field pl-10" />
        </div>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="form-field sm:w-40">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="form-field sm:w-36">
          <option value="all">All Status</option>
          {statuses.map((s) => <option key={s} className="capitalize">{s}</option>)}
        </select>
        <button onClick={openAdd} className="btn btn-primary shrink-0">
          <Plus className="h-4.5 w-4.5" /> Add Vehicle
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden">
          <thead>
            <tr className="bg-ink-50/80 border-b border-ink-100">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 text-left font-semibold text-ink-600 whitespace-nowrap ${col.label === "" ? "text-right" : ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {paginated.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-ink-400">No vehicles found</td></tr>
            ) : paginated.map((c) => (
              <tr key={c.id} className="hover:bg-ink-50/40">
                {columns.map((col) => <td key={col.key} className="px-4 py-3">{col.render(c)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-500">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</p>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-600 hover:bg-ink-100 disabled:opacity-40">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`h-8 w-8 rounded-lg text-xs font-semibold ${i + 1 === page ? "bg-primary-600 text-white" : "text-ink-600 hover:bg-ink-100"}`}>{i + 1}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-600 hover:bg-ink-100 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Vehicle" : "Add New Vehicle"}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={!form.name || !form.brand} className="btn btn-primary">{editing ? "Save Changes" : "Add Vehicle"}</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-field" /></Field>
          <Field label="Brand"><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="form-field" /></Field>
          <Field label="Category">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-field">
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="form-field capitalize">
              {statuses.map((s) => <option key={s} className="capitalize">{s}</option>)}
            </select>
          </Field>
          <Field label="Price/Day ($)"><input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })} className="form-field" /></Field>
          <Field label="Seats"><input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} className="form-field" /></Field>
          <Field label="Transmission">
            <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className="form-field">
              <option>Automatic</option><option>Manual</option>
            </select>
          </Field>
          <Field label="Fuel Type">
            <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })} className="form-field">
              <option>Regular Unleaded</option><option>Premium Unleaded</option><option>Diesel</option><option>Electric</option>
            </select>
          </Field>
          <div className="col-span-2">
            <Field label="Image URL"><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="form-field" placeholder="https://…" /></Field>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}

function Field({ label, children }) {
  return <div><label className="label text-xs">{label}</label>{children}</div>;
}
