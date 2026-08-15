import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Car, User, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/cars", label: "Fleet" },
  { to: "/deals", label: "Deals" },
  { to: "/dashboard", label: "My Trips" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-soft" : "bg-white"
      } border-b border-ink-100`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" onClick={close} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-800 text-white">
            <Car className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-ink-900">
            Drive<span className="text-primary-800">Easy</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "text-primary-800 bg-primary-50" : "text-ink-600 hover:text-ink-900 hover:bg-ink-50"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                className="btn btn-secondary btn-sm"
              >
                {isAdmin ? <LayoutDashboard className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                {isAdmin ? "Admin" : "Dashboard"}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <User className="h-4 w-4" /> Sign In
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-ink-700 hover:bg-ink-50"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-ink-100 bg-white animate-fade-in">
          <div className="container-page py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={close}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive ? "text-primary-800 bg-primary-50" : "text-ink-700 hover:bg-ink-50"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="h-px bg-ink-100 my-2" />
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  onClick={close}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50 flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" /> {isAdmin ? "Admin Panel" : "My Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-error bg-error/10 hover:bg-error/15 flex items-center gap-2 text-left"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={close}
                className="btn btn-primary w-full mt-2"
              >
                <User className="h-4 w-4" /> Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
