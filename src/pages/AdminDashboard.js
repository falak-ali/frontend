import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Car, Users, Calendar, ShieldCheck, TrendingUp, DollarSign, CheckCircle2, Clock,
} from "lucide-react";
import { cars as allCars } from "../data/cars";
import authService from "../services/authService";
import bookingService from "../services/bookingService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCars: 0, availableCars: 0, totalUsers: 0, pendingVerifications: 0,
    totalBookings: 0, activeRentals: 0, revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const users = authService.getAllUsers();
    const pendingVerifications = users.filter(
      (u) => u.verification && (u.verification.cnic === "pending" || u.verification.license === "pending") && u.role !== "admin"
    ).length;

    bookingService.getAll().then((bookings) => {
      const revenue = bookings.reduce((sum, b) => sum + (b.total || 0), 0);
      const active = bookings.filter((b) => b.status === "active").length;
      setStats({
        totalCars: allCars.length,
        availableCars: allCars.filter((c) => c.available).length,
        totalUsers: users.filter((u) => u.role !== "admin").length,
        pendingVerifications,
        totalBookings: bookings.length,
        activeRentals: active,
        revenue,
      });
      setRecentBookings(bookings.slice(-5).reverse());
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Total Cars", value: stats.totalCars, icon: Car, color: "primary" },
    { label: "Available", value: stats.availableCars, icon: CheckCircle2, color: "success" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "primary" },
    { label: "Pending Verification", value: stats.pendingVerifications, icon: ShieldCheck, color: "warning" },
    { label: "Total Bookings", value: stats.totalBookings, icon: Calendar, color: "primary" },
    { label: "Active Rentals", value: stats.activeRentals, icon: TrendingUp, color: "success" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "success" },
  ];

  if (loading) {
    return <div className="flex justify-center py-20"><Clock className="h-8 w-8 text-primary-800 animate-pulse" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Admin Dashboard</h1>
      <p className="text-ink-500 text-sm mt-1">Platform overview and key metrics.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {statCards.map((s) => (
          <div key={s.label} className="card p-4">
            <span className={`h-9 w-9 rounded-xl flex items-center justify-center ${
              s.color === "primary" ? "bg-primary-50 text-primary-800" :
              s.color === "success" ? "bg-success-100 text-success-700" :
              "bg-warning-100 text-warning-700"
            }`}>
              <s.icon className="h-4.5 w-4.5" />
            </span>
            <p className="text-xl font-extrabold text-ink-900 mt-3">{s.value}</p>
            <p className="text-xs text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <QuickLink to="/admin/cars" icon={Car} title="Manage Cars" desc="Add, edit and manage fleet" />
        <QuickLink to="/admin/users" icon={Users} title="Manage Users" desc="View users and verifications" />
        <QuickLink to="/admin/bookings" icon={Calendar} title="Manage Bookings" desc="View and update bookings" />
      </div>

      {/* Recent bookings */}
      {recentBookings.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-ink-900 mb-4">Recent Bookings</h2>
          <div className="card divide-y divide-ink-100">
            {recentBookings.map((b) => (
              <Link
                key={b.id}
                to="/admin/bookings"
                className="flex items-center gap-4 p-4 hover:bg-ink-50/50 transition"
              >
                <img src={b.carImage} alt={b.carName} className="h-12 w-18 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-900 text-sm truncate">{b.carName}</p>
                  <p className="text-xs text-ink-500">{b.id} · {b.customer?.fullName || "—"}</p>
                </div>
                <span className="badge bg-primary-100 text-primary-800 capitalize">{b.status}</span>
                <p className="text-sm font-bold text-ink-900">${b.total}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to} className="card p-5 hover:shadow-lift transition-shadow group">
      <span className="h-10 w-10 rounded-xl bg-primary-50 text-primary-800 flex items-center justify-center group-hover:bg-primary-800 group-hover:text-white transition-colors">
        <Icon className="h-5 w-5" />
      </span>
      <p className="font-bold text-ink-900 mt-3">{title}</p>
      <p className="text-sm text-ink-500">{desc}</p>
    </Link>
  );
}
