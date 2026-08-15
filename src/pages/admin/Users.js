import { useMemo, useState } from "react";
import { Search, Users as UsersIcon, ShieldCheck, ShieldAlert, Ban, Plus, Pencil, Eye } from "lucide-react";
import AdminModal from "../../components/admin/AdminModal";
import StatCard from "../../components/admin/StatCard";
import { StatusBadge } from "../../components/admin/DataTable";
import { adminUsers } from "../../data/adminData";
import { formatPrice, formatDate } from "../../utils/format";

const kycStyles = {
  approved: "text-success-600 bg-success-50",
  pending: "text-warning-600 bg-warning-50",
  rejected: "text-error-600 bg-error-50",
};

export default function Users() {
  const [users, setUsers] = useState(adminUsers);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const pageSize = 8;

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [users, query, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = {
    total: users.length,
    pendingKyc: users.filter((u) => u.cnic === "pending" || u.license === "pending").length,
    verified: users.filter((u) => u.cnic === "approved" && u.license === "approved").length,
    blocked: users.filter((u) => u.status === "blocked").length,
  };

  const toggleBlock = (id) => {
    setUsers((us) => us.map((u) => (u.id === id ? { ...u, status: u.status === "blocked" ? "active" : "blocked" } : u)));
    setSelected((s) => (s?.id === id ? { ...s, status: s.status === "blocked" ? "active" : "blocked" } : s));
  };

  const openAdd = () => { setEditing(null); setForm({ name: "", email: "", phone: "" }); setModalOpen(true); };
  const openEdit = (u) => { setEditing(u); setForm({ name: u.name, email: u.email, phone: u.phone }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editing) {
      setUsers((us) => us.map((u) => (u.id === editing.id ? { ...u, ...form } : u)));
    } else {
      setUsers((us) => [{ id: `u_${Date.now()}`, ...form, joined: new Date().toISOString().split("T")[0], status: "active", bookings: 0, cnic: "pending", license: "pending", totalSpent: 0 }, ...us]);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.total.toLocaleString()} icon={UsersIcon} color="primary" />
        <StatCard label="Pending KYC" value={stats.pendingKyc} icon={ShieldAlert} color="warning" />
        <StatCard label="Verified Users" value={stats.verified} icon={ShieldCheck} color="success" />
        <StatCard label="Blocked Users" value={stats.blocked} icon={Ban} color="error" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input type="text" placeholder="Search users…" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="form-field pl-10" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="form-field sm:w-36">
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <button onClick={openAdd} className="btn btn-primary shrink-0">
          <Plus className="h-4.5 w-4.5" /> Add User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden">
          <thead>
            <tr className="bg-ink-50/80 border-b border-ink-100">
              <th className="px-4 py-3 text-left font-semibold text-ink-600">User</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-600 hidden md:table-cell">CNIC</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-600 hidden md:table-cell">License</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-600 hidden sm:table-cell">Bookings</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-600 hidden lg:table-cell">Total Spent</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-600">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-ink-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {paginated.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-ink-400">No users found</td></tr>
            ) : paginated.map((u) => (
              <tr key={u.id} className="hover:bg-ink-50/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">{u.name.charAt(0)}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-900 truncate">{u.name}</p>
                      <p className="text-xs text-ink-500 truncate">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell"><span className={`badge capitalize ${kycStyles[u.cnic]}`}>{u.cnic}</span></td>
                <td className="px-4 py-3 hidden md:table-cell"><span className={`badge capitalize ${kycStyles[u.license]}`}>{u.license}</span></td>
                <td className="px-4 py-3 hidden sm:table-cell text-ink-600">{u.bookings}</td>
                <td className="px-4 py-3 hidden lg:table-cell font-semibold text-ink-900">{formatPrice(u.totalSpent)}</td>
                <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => setSelected(u)} className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-100 hover:text-primary-600"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-100 hover:text-primary-600"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => toggleBlock(u.id)} className={`p-1.5 rounded-lg ${u.status === "blocked" ? "text-success-600 hover:bg-success-50" : "text-error-600 hover:bg-error-50"}`} title={u.status === "blocked" ? "Unblock" : "Block"}>
                      {u.status === "blocked" ? <ShieldCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
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

      {/* Detail modal */}
      <AdminModal open={!!selected} onClose={() => setSelected(null)} title="User Details">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold">{selected.name.charAt(0)}</div>
              <div>
                <p className="font-bold text-ink-900">{selected.name}</p>
                <p className="text-sm text-ink-500">{selected.email}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-ink-400">Phone</p><p className="font-medium text-ink-900">{selected.phone || "—"}</p></div>
              <div><p className="text-xs text-ink-400">Joined</p><p className="font-medium text-ink-900">{formatDate(selected.joined)}</p></div>
              <div><p className="text-xs text-ink-400">Total Bookings</p><p className="font-medium text-ink-900">{selected.bookings}</p></div>
              <div><p className="text-xs text-ink-400">Total Spent</p><p className="font-medium text-ink-900">{formatPrice(selected.totalSpent)}</p></div>
              <div><p className="text-xs text-ink-400">CNIC Status</p><span className={`badge capitalize ${kycStyles[selected.cnic]}`}>{selected.cnic}</span></div>
              <div><p className="text-xs text-ink-400">License Status</p><span className={`badge capitalize ${kycStyles[selected.license]}`}>{selected.license}</span></div>
            </div>
            <button onClick={() => toggleBlock(selected.id)} className={`btn w-full ${selected.status === "blocked" ? "btn-primary" : "btn-secondary text-error-600 border-error-200 hover:bg-error-50"}`}>
              {selected.status === "blocked" ? "Unblock User" : "Block User"}
            </button>
          </div>
        )}
      </AdminModal>

      {/* Add/Edit modal */}
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit User" : "Add User"}
        footer={<><button onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button><button onClick={handleSave} disabled={!form.name || !form.email} className="btn btn-primary">{editing ? "Save" : "Add"}</button></>}
      >
        <div className="space-y-3">
          <div><label className="label text-xs">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-field" /></div>
          <div><label className="label text-xs">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-field" /></div>
          <div><label className="label text-xs">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-field" placeholder="0300-1234567" /></div>
        </div>
      </AdminModal>
    </div>
  );
}
