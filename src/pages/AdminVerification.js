import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ShieldCheck, FileImage, Loader2, Search } from "lucide-react";
import authService from "../services/authService";
import verificationService from "../services/verificationService";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";

const TABS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All Users" },
];

const STATUS_COLORS = {
  approved: "text-success-600",
  rejected: "text-error-600",
  pending: "text-warning-600",
  not_submitted: "text-ink-400",
};

export default function AdminVerification() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("pending");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    const all = authService.getAllUsers().filter((u) => u.role !== "admin");
    if (active) {
      setUsers(all);
      setLoading(false);
    }
    return () => { active = false; };
  }, []);

  const getUserStatus = (u) => {
    const v = u.verification;
    if (!v || (!v.cnicFront && !v.licenseFront)) return "not_submitted";
    if (v.cnic === "approved" && v.license === "approved") return "approved";
    if (v.cnic === "rejected" || v.license === "rejected") return "rejected";
    return "pending";
  };

  const filtered = users
    .filter((u) => {
      if (tab === "all") return true;
      if (tab === "pending") return getUserStatus(u) === "pending";
      if (tab === "approved") return getUserStatus(u) === "approved";
      if (tab === "rejected") return getUserStatus(u) === "rejected";
      return true;
    })
    .filter((u) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    });

  const pendingCount = users.filter((u) => getUserStatus(u) === "pending").length;

  const handleAction = async (userId, type, status) => {
    const result = await verificationService.updateStatus(userId, type, status);
    setUsers((us) => us.map((u) => (u.id === userId ? { ...u, verification: result } : u)));
    setSelected((s) => (s?.id === userId ? { ...s, verification: result } : s));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary-800 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Verification Requests</h1>
      <p className="text-ink-500 text-sm mt-1">{pendingCount} pending review</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mt-5">
        {TABS.map((t) => {
          const count =
            t.id === "all" ? users.length :
            t.id === "pending" ? pendingCount :
            users.filter((u) => getUserStatus(u) === t.id).length;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t.id
                  ? "bg-primary-800 text-white"
                  : "bg-white text-ink-600 border border-ink-200 hover:border-primary-300"
              }`}
            >
              {t.label} <span className={tab === t.id ? "text-white/70" : "text-ink-400"}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-field pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={search ? "No matching users" : "No verification requests"}
          description={search ? "Try a different search term." : "When users submit their documents, they'll appear here for review."}
        />
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map((u) => {
            const v = u.verification || {};
            const hasDocs = v.cnicFront || v.licenseFront;
            const userStatus = getUserStatus(u);
            return (
              <div key={u.id} className="card p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-sm shrink-0">
                  {u.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-900 text-sm truncate">{u.name}</p>
                  <p className="text-xs text-ink-500 truncate">{u.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <StatusBadge label="CNIC" status={v.cnic || "not_submitted"} />
                  <StatusBadge label="License" status={v.license || "not_submitted"} />
                </div>
                <span className={`text-xs font-semibold capitalize sm:hidden ${STATUS_COLORS[userStatus]}`}>
                  {userStatus.replace("_", " ")}
                </span>
                {hasDocs ? (
                  <button onClick={() => setSelected(u)} className="btn btn-secondary btn-sm shrink-0">
                    Review
                  </button>
                ) : (
                  <span className="text-xs text-ink-400 shrink-0">No docs</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Verify — ${selected?.name || ""}`}
      >
        {selected && (
          <div className="space-y-5">
            <p className="text-sm text-ink-500">{selected.email} · {selected.phone || "No phone"}</p>

            {selected.verification?.submittedAt && (
              <p className="text-xs text-ink-400">
                Submitted on {new Date(selected.verification.submittedAt).toLocaleDateString()}
              </p>
            )}

            <DocSection
              title="CNIC"
              front={selected.verification?.cnicFront}
              back={selected.verification?.cnicBack}
              status={selected.verification?.cnic}
              onApprove={() => handleAction(selected.id, "cnic", "approved")}
              onReject={() => handleAction(selected.id, "cnic", "rejected")}
            />
            <DocSection
              title="Driving License"
              front={selected.verification?.licenseFront}
              back={selected.verification?.licenseBack}
              status={selected.verification?.license}
              onApprove={() => handleAction(selected.id, "license", "approved")}
              onReject={() => handleAction(selected.id, "license", "rejected")}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatusBadge({ label, status }) {
  const color = STATUS_COLORS[status] || "text-ink-400";
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-ink-500">{label}</span>
      <span className={`text-xs font-semibold capitalize ${color}`}>
        {status === "not_submitted" ? "—" : status}
      </span>
    </div>
  );
}

function DocSection({ title, front, back, status, onApprove, onReject }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-ink-900 text-sm">{title}</h4>
        <span className={`text-xs font-semibold capitalize ${STATUS_COLORS[status] || "text-ink-400"}`}>
          {status === "not_submitted" ? "Not submitted" : status}
        </span>
      </div>
      {front || back ? (
        <div className="grid grid-cols-2 gap-3">
          {front && <DocImage label="Front" src={front} />}
          {back && <DocImage label="Back" src={back} />}
        </div>
      ) : (
        <div className="bg-ink-50 rounded-xl p-4 text-center text-sm text-ink-400 flex flex-col items-center gap-2">
          <FileImage className="h-6 w-6" /> No documents uploaded
        </div>
      )}
      {status === "pending" && (front || back) && (
        <div className="flex gap-2 mt-3">
          <button onClick={onApprove} className="btn btn-secondary btn-sm bg-success-100 text-success-700 border-success-200 hover:bg-success-200">
            <CheckCircle2 className="h-4 w-4" /> Approve
          </button>
          <button onClick={onReject} className="btn btn-secondary btn-sm bg-error-100 text-error-700 border-error-200 hover:bg-error-200">
            <XCircle className="h-4 w-4" /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

function DocImage({ label, src }) {
  return (
    <div>
      <p className="text-xs text-ink-400 mb-1">{label}</p>
      <img src={src} alt={`${label} document`} className="w-full aspect-[3/2] rounded-lg object-cover border border-ink-200" />
    </div>
  );
}
