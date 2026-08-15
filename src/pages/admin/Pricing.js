import { useState } from "react";
import { Plus, Pencil, Trash2, DollarSign, Percent, TrendingUp, Eye } from "lucide-react";
import AdminModal from "../../components/admin/AdminModal";
import StatCard from "../../components/admin/StatCard";
import { adminFleet, pricingRules as initialRules } from "../../data/adminData";
import { formatPrice } from "../../utils/format";

const ruleTypes = ["weekend", "holiday", "high-demand", "long-rental", "early-bird"];
const emptyRule = { name: "", type: "weekend", discount: 10, active: true, description: "" };

export default function Pricing() {
  const [rules, setRules] = useState(initialRules);
  const [fleet] = useState(adminFleet);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRule);
  const [previewCar, setPreviewCar] = useState(fleet[0]?.id || "");
  const [previewDays, setPreviewDays] = useState(3);
  const [previewWeekend, setPreviewWeekend] = useState(true);

  const stats = {
    avgPrice: Math.round(fleet.reduce((s, c) => s + c.pricePerDay, 0) / fleet.length),
    activeRules: rules.filter((r) => r.active).length,
    maxDiscount: Math.max(...rules.filter((r) => r.active && r.discount > 0).map((r) => r.discount), 0),
    totalRules: rules.length,
  };

  const openAdd = () => { setEditing(null); setForm(emptyRule); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name) return;
    if (editing) {
      setRules((rs) => rs.map((r) => (r.id === editing.id ? { ...form, id: editing.id } : r)));
    } else {
      setRules((rs) => [...rs, { ...form, id: `pr_${Date.now()}` }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this pricing rule?")) return;
    setRules((rs) => rs.filter((r) => r.id !== id));
  };

  const toggleActive = (id) => {
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  // Smart pricing preview
  const selectedCar = fleet.find((c) => c.id === previewCar);
  const basePrice = selectedCar ? selectedCar.pricePerDay * previewDays : 0;
  let appliedDiscount = 0;
  const applicableRules = rules.filter((r) => r.active);
  if (previewWeekend) {
    const weekendRule = applicableRules.find((r) => r.type === "weekend");
    if (weekendRule) appliedDiscount += Math.abs(weekendRule.discount);
  }
  if (previewDays >= 7) {
    const longRule = applicableRules.find((r) => r.type === "long-rental");
    if (longRule) appliedDiscount += Math.abs(longRule.discount);
  }
  const discountAmount = Math.round(basePrice * (appliedDiscount / 100));
  const finalPrice = basePrice - discountAmount;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg Price/Day" value={formatPrice(stats.avgPrice)} icon={DollarSign} color="primary" />
        <StatCard label="Active Rules" value={stats.activeRules} icon={Percent} color="success" />
        <StatCard label="Max Discount" value={`${stats.maxDiscount}%`} icon={TrendingUp} color="warning" />
        <StatCard label="Total Rules" value={stats.totalRules} icon={DollarSign} color="neutral" />
      </div>

      {/* Vehicle pricing table */}
      <div>
        <h3 className="font-bold text-ink-900 mb-3">Vehicle Pricing</h3>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden">
            <thead>
              <tr className="bg-ink-50/80 border-b border-ink-100">
                <th className="px-4 py-3 text-left font-semibold text-ink-600">Vehicle</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-600 hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-600">Base Price</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-600 hidden md:table-cell">Bookings</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {fleet.map((c) => (
                <tr key={c.id} className="hover:bg-ink-50/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt={c.name} className="h-8 w-12 rounded-lg object-cover shrink-0" />
                      <span className="font-semibold text-ink-900 truncate">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-ink-600">{c.category}</td>
                  <td className="px-4 py-3 font-bold text-ink-900">{formatPrice(c.pricePerDay)}<span className="text-xs text-ink-400 font-normal">/day</span></td>
                  <td className="px-4 py-3 hidden md:table-cell text-ink-600">{c.bookings}</td>
                  <td className="px-4 py-3"><span className={`badge capitalize ${c.status === "available" ? "bg-success-50 text-success-700" : c.status === "rented" ? "bg-primary-50 text-primary-700" : "bg-warning-50 text-warning-700"}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing rules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-ink-900">Pricing Rules</h3>
          <button onClick={openAdd} className="btn btn-primary btn-sm"><Plus className="h-4 w-4" /> Add Rule</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-ink-900 text-sm">{r.name}</p>
                  <p className="text-xs text-ink-500 mt-0.5 capitalize">{r.type.replace("-", " ")}</p>
                </div>
                <span className={`badge ${r.discount > 0 ? "bg-success-50 text-success-700" : "bg-error-50 text-error-600"}`}>
                  {r.discount > 0 ? `${r.discount}% off` : `${Math.abs(r.discount)}% surcharge`}
                </span>
              </div>
              <p className="text-xs text-ink-500 mb-3">{r.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-ink-100">
                <button onClick={() => toggleActive(r.id)} className={`text-xs font-semibold ${r.active ? "text-success-600" : "text-ink-400"}`}>
                  {r.active ? "Active" : "Inactive"}
                </button>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-100 hover:text-primary-600"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg text-ink-500 hover:bg-error-50 hover:text-error-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart pricing preview */}
      <div className="card p-5">
        <h3 className="font-bold text-ink-900 flex items-center gap-2 mb-1"><Eye className="h-4 w-4 text-primary-600" /> Smart Pricing Preview</h3>
        <p className="text-xs text-ink-500 mb-4">See how rules apply to a booking in real time</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="label text-xs">Vehicle</label>
            <select value={previewCar} onChange={(e) => setPreviewCar(e.target.value)} className="form-field">
              {fleet.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label text-xs">Days</label>
            <input type="number" min={1} value={previewDays} onChange={(e) => setPreviewDays(Math.max(1, Number(e.target.value)))} className="form-field" />
          </div>
          <div>
            <label className="label text-xs">Weekend?</label>
            <select value={previewWeekend ? "yes" : "no"} onChange={(e) => setPreviewWeekend(e.target.value === "yes")} className="form-field">
              <option value="yes">Yes</option><option value="no">No</option>
            </select>
          </div>
        </div>
        <div className="bg-ink-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-ink-500">Base ({previewDays} × {formatPrice(selectedCar?.pricePerDay || 0)})</span><span className="font-semibold text-ink-900">{formatPrice(basePrice)}</span></div>
          {appliedDiscount > 0 && <div className="flex justify-between text-sm"><span className="text-success-600">Discount ({appliedDiscount}%)</span><span className="font-semibold text-success-600">-{formatPrice(discountAmount)}</span></div>}
          <div className="flex justify-between pt-2 border-t border-ink-200"><span className="font-bold text-ink-900">Final Price</span><span className="text-xl font-extrabold text-primary-700">{formatPrice(finalPrice)}</span></div>
        </div>
      </div>

      {/* Add/Edit rule modal */}
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Rule" : "Add Pricing Rule"}
        footer={<><button onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button><button onClick={handleSave} disabled={!form.name} className="btn btn-primary">{editing ? "Save" : "Add"}</button></>}
      >
        <div className="space-y-3">
          <div><label className="label text-xs">Rule Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-field" placeholder="Weekend Discount" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label text-xs">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="form-field capitalize">{ruleTypes.map((t) => <option key={t} className="capitalize">{t}</option>)}</select></div>
            <div><label className="label text-xs">{form.discount >= 0 ? "Discount %" : "Surcharge %"}</label><input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} className="form-field" /></div>
          </div>
          <div><label className="label text-xs">Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-field" placeholder="10% off Friday–Sunday" /></div>
          <label className="flex items-center gap-2 text-sm text-ink-600 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded border-ink-300 text-primary-600" />
            Active
          </label>
        </div>
      </AdminModal>
    </div>
  );
}
