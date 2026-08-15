import {
  Users, CalendarCheck, DollarSign, Car, CheckCircle2, Wrench,
  TrendingUp, MapPin,
} from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import { StatusBadge } from "../../components/admin/DataTable";
import { adminStats, bookingsTrend, fleetStatusData, fleetTracking, adminBookings } from "../../data/adminData";
import { formatPrice, formatDate } from "../../utils/format";

export default function Dashboard() {
  const maxBookings = Math.max(...bookingsTrend.map((d) => d.bookings));
  const totalFleet = fleetStatusData.reduce((s, d) => s + d.value, 0);
  const recentBookings = adminBookings.slice(0, 6);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={adminStats.totalUsers.toLocaleString()} icon={Users} color="primary" trend={{ direction: "up", value: "12.5%" }} sublabel="vs last month" />
        <StatCard label="Active Bookings" value={adminStats.activeBookings} icon={CalendarCheck} color="success" trend={{ direction: "up", value: "8.2%" }} sublabel="vs last week" />
        <StatCard label="Revenue Today" value={formatPrice(adminStats.revenueToday)} icon={DollarSign} color="success" trend={{ direction: "up", value: "5.1%" }} sublabel="vs yesterday" />
        <StatCard label="Total Fleet" value={adminStats.totalFleet} icon={Car} color="primary" sublabel={`${adminStats.rentedCars} currently rented`} />
        <StatCard label="Available Cars" value={adminStats.availableCars} icon={CheckCircle2} color="success" sublabel="ready for booking" />
        <StatCard label="In Maintenance" value={adminStats.maintenance} icon={Wrench} color="warning" sublabel="unavailable" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bookings trend — bar chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-ink-900">Bookings Trend</h3>
              <p className="text-xs text-ink-500">Monthly bookings over the year</p>
            </div>
            <span className="badge bg-success-50 text-success-700">
              <TrendingUp className="h-3.5 w-3.5" /> Trending up
            </span>
          </div>
          <div className="flex items-end justify-between gap-2 sm:gap-3 h-48">
            {bookingsTrend.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex-1 flex items-end relative">
                  <div
                    className="w-full rounded-t-lg bg-primary-600 group-hover:bg-primary-700 transition-all duration-300 relative"
                    style={{ height: `${(d.bookings / maxBookings) * 100}%` }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-ink-900 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {d.bookings}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-ink-500 font-medium">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet status — donut */}
        <div className="card p-5">
          <h3 className="font-bold text-ink-900 mb-1">Fleet Status</h3>
          <p className="text-xs text-ink-500 mb-5">Current vehicle distribution</p>
          <div className="flex items-center justify-center mb-5">
            <DonutChart data={fleetStatusData} total={totalFleet} />
          </div>
          <div className="space-y-2">
            {fleetStatusData.map((d) => (
              <div key={d.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-ink-600">{d.label}</span>
                </div>
                <span className="font-semibold text-ink-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live fleet tracking + recent bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Live map */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-ink-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-600" /> Live Fleet Tracking
              </h3>
              <p className="text-xs text-ink-500">Real-time vehicle locations</p>
            </div>
            <span className="badge bg-success-50 text-success-700">
              <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse" /> Live
            </span>
          </div>
          <div className="relative h-64 rounded-xl bg-gradient-to-br from-primary-950 via-primary-900 to-ink-900 overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }} />
            {/* Map markers */}
            {fleetTracking.map((v) => {
              const x = ((v.lng - 71) / 5) * 100;
              const y = ((36 - v.lat) / 7) * 100;
              const color = v.status === "rented" ? "#3366ff" : v.status === "available" ? "#10b981" : "#f59e0b";
              return (
                <div key={v.id} className="absolute group" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
                  <span className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ backgroundColor: color, width: 24, height: 24 }} />
                  <span className="relative block h-3 w-3 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: color }} />
                  <div className="absolute left-1/2 -translate-x-1/2 -top-20 bg-white rounded-lg shadow-lift px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-44">
                    <p className="text-xs font-bold text-ink-900 truncate">{v.name}</p>
                    <p className="text-xs text-ink-500">{v.city} · <span className="capitalize">{v.status}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-success-500" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary-600" /> Rented</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-warning-500" /> Maintenance</span>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="card p-5">
          <h3 className="font-bold text-ink-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-3 py-2 border-b border-ink-50 last:border-0">
                <div className="h-9 w-9 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {b.customer.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">{b.customer}</p>
                  <p className="text-xs text-ink-500 truncate">{b.car} · {formatDate(b.pickupDate)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-ink-900">{formatPrice(b.total)}</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutChart({ data, total }) {
  const radius = 60;
  const stroke = 20;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
      <circle cx="80" cy="80" r={radius} fill="none" stroke="#f6f7f9" strokeWidth={stroke} />
      {data.map((d) => {
        const dash = (d.value / total) * circumference;
        const segment = (
          <circle
            key={d.label}
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={d.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
          />
        );
        offset += dash;
        return segment;
      })}
      <text x="80" y="76" textAnchor="middle" className="transform rotate-90" fill="#0f172a" fontSize="28" fontWeight="800" style={{ transformOrigin: "center" }}>
        {total}
      </text>
      <text x="80" y="96" textAnchor="middle" className="transform rotate-90" fill="#67718d" fontSize="11" fontWeight="500" style={{ transformOrigin: "center" }}>
        Vehicles
      </text>
    </svg>
  );
}
