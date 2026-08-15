import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, User, Calendar, ShieldCheck, LogOut, Car, Menu, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/bookings", label: "My Bookings", icon: Calendar },
  { to: "/dashboard/verification", label: "Verification", icon: ShieldCheck },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = (
    <div className="space-y-1">
      <div className="px-3 py-4 mb-2 border-b border-ink-100">
        <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-sm">
          {user?.name?.charAt(0) || "U"}
        </div>
        <p className="font-semibold text-ink-900 text-sm mt-2 truncate">{user?.name}</p>
        <p className="text-xs text-ink-500 truncate">{user?.email}</p>
      </div>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive ? "bg-primary-50 text-primary-800" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
            }`
          }
        >
          <l.icon className="h-4.5 w-4.5" /> {l.label}
        </NavLink>
      ))}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error-600 hover:bg-error-50 transition-colors"
      >
        <LogOut className="h-4.5 w-4.5" /> Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50/50">
      <div className="container-page py-6">
        {/* Mobile header */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-800 text-white">
              <Car className="h-4.5 w-4.5" />
            </span>
            <span className="font-extrabold text-ink-900">Drive<span className="text-primary-800">Easy</span></span>
          </Link>
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg text-ink-700 hover:bg-ink-100">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="card p-3 sticky top-24">{SidebarContent}</div>
          </aside>

          {/* Mobile drawer */}
          {open && (
            <div className="fixed inset-0 z-[100] lg:hidden">
              <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white shadow-lift overflow-y-auto p-3 animate-fade-in">
                <div className="flex justify-end mb-2">
                  <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-ink-50">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {SidebarContent}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
