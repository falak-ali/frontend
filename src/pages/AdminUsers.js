import { useEffect, useState } from "react";
import { Search, CheckCircle2, XCircle, Clock, ShieldCheck } from "lucide-react";
import authService from "../services/authService";
import verificationService from "../services/verificationService";
import EmptyState from "../components/EmptyState";
import { formatDate } from "../utils/format";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setUsers(authService.getAllUsers());
  }, []);

  const filtered = users.filter((u) => {
    if (u.role === "admin") return false;
    if (query && !u.name.toLowerCase().includes(query.toLowerCase()) && !u.email.toLowerCase().includes(query.toLowerCase())) return false;
    if (filter === "verified" && !(u.verification?.cnic === "approved" && u.verification?.license === "approved")) return false;
    if (filter === "pending" && !(u.verification?.cnic === "pending" || u.verification?.license === "pending")) return false;
    if (filter === "rejected" && !(u.verification?.cnic === "rejected" || u.verification?.license === "rejected")) return false;
    return true;
  });

  const handleApprove = async (userId, type) => {
    const result = await verificationService.updateStatus(userId, type, "approved");
    setUsers((us) => us.map((u) => (u.id === userId ? { ...u, verification: result } : u)));
  };

  const handleReject = async (userId, type) => {
    const result = await verificationService.updateStatus(userId, type, "rejected");
    setUsers((us) => us.map((u) => (u.id === userId ? { ...u, verification: result } : u)));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Manage Users</h1>
      <p className="text-ink-500 text-sm mt-1">{users.filter((u) => u.role !== "admin").length} registered users</p>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-ink-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-field pl-10"
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="form-field sm:w-48">
          <option value="all">All Users</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map((u) => {
            const v = u.verification || { cnic: "pending", license: "pending" };
            return (
              <div key={u.id} className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-sm shrink-0">
                    {u.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-900 text-sm truncate">{u.name}</p>
                    <p className="text-xs text-ink-500 truncate">{u.email} · {u.phone || "No phone"}</p>
                    <p className="text-xs text-ink-400 mt-0.5">Joined {formatDate(u.createdAt)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-ink-100">
                  <VerificationRow
                    label="CNIC"
                    status={v.cnic}
                    onApprove={() => handleApprove(u.id, "cnic")}
                    onReject={() => handleReject(u.id, "cnic")}
                  />
                  <VerificationRow
                    label="License"
                    status={v.license}
                    onApprove={() => handleApprove(u.id, "license")}
                    onReject={() => handleReject(u.id, "license")}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function VerificationRow({ label, status, onApprove, onReject }) {
  const icon = status === "approved" ? <CheckCircle2 className="h-4 w-4 text-success-600" /> :
               status === "rejected" ? <XCircle className="h-4 w-4 text-error-600" /> :
               <Clock className="h-4 w-4 text-warning-600" />;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5 text-ink-400" />
        <span className="text-sm text-ink-600">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium capitalize text-ink-700">{status}</span>
        {status === "pending" && (
          <div className="flex gap-1 ml-1">
            <button onClick={onApprove} className="h-6 px-2 rounded-lg bg-success-100 text-success-700 text-xs font-medium hover:bg-success-200">Approve</button>
            <button onClick={onReject} className="h-6 px-2 rounded-lg bg-error-100 text-error-700 text-xs font-medium hover:bg-error-200">Reject</button>
          </div>
        )}
      </div>
    </div>
  );
}
