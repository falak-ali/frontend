import { useState } from "react";
import { User, Mail, Phone, ShieldCheck, Save, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateUser({ name: form.name, email: form.email, phone: form.phone });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 500);
  };

  const verification = user?.verification || { cnic: "pending", license: "pending" };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">My Profile</h1>
      <p className="text-ink-500 text-sm mt-1">Update your personal information.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mt-6">
        <form onSubmit={handleSave} className="card p-5 sm:p-6 space-y-4">
          <div>
            <label className="label flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-field" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-field" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-field" />
          </div>

          {saved && <p className="text-sm text-success-600 bg-success-50 rounded-lg px-3 py-2">Profile updated successfully.</p>}

          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <><Save className="h-4.5 w-4.5" /> Save Changes</>}
          </button>
        </form>

        <div className="space-y-4">
          <div className="card p-5 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-xl">
              {user?.name?.charAt(0) || "U"}
            </div>
            <p className="font-semibold text-ink-900 mt-3">{user?.name}</p>
            <p className="text-xs text-ink-500">{user?.email}</p>
            <span className="badge bg-primary-100 text-primary-800 mt-3 capitalize">{user?.role}</span>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink-900 text-sm flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-primary-800" /> Verification Status
            </h3>
            <div className="space-y-2">
              <StatusRow label="CNIC" status={verification.cnic} />
              <StatusRow label="Driving License" status={verification.license} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, status }) {
  const color = status === "approved" ? "text-success-600" : status === "rejected" ? "text-error-600" : "text-warning-600";
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-600">{label}</span>
      <span className={`font-semibold capitalize ${color}`}>{status}</span>
    </div>
  );
}
