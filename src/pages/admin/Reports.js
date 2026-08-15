import { DollarSign, CalendarCheck, Car, Clock, TrendingUp, BarChart3 } from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import { adminReports, bookingsTrend, fleetStatusData } from "../../data/adminData";
import { formatPrice } from "../../utils/format";

export default function Reports() {
  const { totalRevenue, totalBookings, fleetUtilization, avgRentalDays, popularVehicles } = adminReports;
  const maxRevenue = Math.max(...bookingsTrend.map((d) => d.revenue));
  const maxVBooking = Math.max(...popularVehicles.map((v) => v.bookings));
  const totalFleet = fleetStatusData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={formatPrice(totalRevenue)} icon={DollarSign} color="success" trend={{ direction: "up", value: "18.3%" }} sublabel="vs last year" />
        <StatCard label="Total Bookings" value={totalBookings.toLocaleString()} icon={CalendarCheck} color="primary" trend={{ direction: "up", value: "22.7%" }} sublabel="vs last year" />
        <StatCard label="Fleet Utilization" value={`${fleetUtilization}%`} icon={Car} color="primary" trend={{ direction: "up", value: "4.2%" }} sublabel="vs last month" />
        <StatCard label="Avg Rental Days" value={avgRentalDays} icon={Clock} color="warning" trend={{ direction: "down", value: "0.3" }} sublabel="vs last month" />
      </div>

      {/* Revenue chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-ink-900 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-success-600" /> Revenue Trend</h3>
            <p className="text-xs text-ink-500">Monthly revenue over the year</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-52">
          {bookingsTrend.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex-1 flex items-end relative">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-success-600 to-success-500 group-hover:from-success-700 transition-all duration-300 relative" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-ink-900 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{formatPrice(d.revenue)}</span>
                </div>
              </div>
              <span className="text-xs text-ink-500 font-medium">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking trend + fleet utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-bold text-ink-900 flex items-center gap-2 mb-1"><BarChart3 className="h-4 w-4 text-primary-600" /> Booking Trend</h3>
          <p className="text-xs text-ink-500 mb-5">Monthly booking counts</p>
          <div className="flex items-end justify-between gap-2 sm:gap-3 h-40">
            {bookingsTrend.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex-1 flex items-end">
                  <div className="w-full rounded-t-lg bg-primary-600 group-hover:bg-primary-700 transition-all" style={{ height: `${(d.bookings / Math.max(...bookingsTrend.map((b) => b.bookings))) * 100}%` }}>
                    <span className="block text-[10px] text-white font-bold text-center pt-1 opacity-0 group-hover:opacity-100">{d.bookings}</span>
                  </div>
                </div>
                <span className="text-xs text-ink-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-ink-900 mb-1">Fleet Utilization</h3>
          <p className="text-xs text-ink-500 mb-5">Current distribution</p>
          <div className="space-y-4">
            {fleetStatusData.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-ink-600 font-medium">{d.label}</span>
                  <span className="font-bold text-ink-900">{d.value} ({Math.round((d.value / totalFleet) * 100)}%)</span>
                </div>
                <div className="h-3 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(d.value / totalFleet) * 100}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular vehicles */}
      <div className="card p-5">
        <h3 className="font-bold text-ink-900 mb-1">Popular Vehicles</h3>
        <p className="text-xs text-ink-500 mb-5">Most booked vehicles by count</p>
        <div className="space-y-3">
          {popularVehicles.map((v, i) => (
            <div key={v.name} className="flex items-center gap-4">
              <span className="h-7 w-7 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-ink-900 truncate">{v.name}</p>
                  <span className="text-xs text-ink-500 shrink-0">{v.bookings} bookings · {formatPrice(v.revenue)}</span>
                </div>
                <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full rounded-full bg-primary-600 transition-all duration-500" style={{ width: `${(v.bookings / maxVBooking) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
