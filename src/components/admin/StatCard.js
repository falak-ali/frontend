export default function StatCard({ label, value, icon: Icon, color = "primary", trend, sublabel }) {
  const colorClasses = {
    primary: "bg-primary-50 text-primary-700",
    success: "bg-success-50 text-success-600",
    warning: "bg-warning-50 text-warning-600",
    error: "bg-error-50 text-error-600",
    neutral: "bg-ink-100 text-ink-600",
  };

  return (
    <div className="card p-5 flex items-start gap-4">
      <span className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${colorClasses[color]}`}>
        {Icon && <Icon className="h-5 w-5" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ink-500 font-medium">{label}</p>
        <p className="text-2xl font-extrabold text-ink-900 mt-0.5 leading-tight">{value}</p>
        {(trend || sublabel) && (
          <div className="flex items-center gap-1.5 mt-1">
            {trend && (
              <span className={`text-xs font-semibold ${trend.direction === "up" ? "text-success-600" : "text-error-600"}`}>
                {trend.direction === "up" ? "↑" : "↓"} {trend.value}
              </span>
            )}
            {sublabel && <span className="text-xs text-ink-400">{sublabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
