// Shared formatting helpers used across the app.

export const formatPrice = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) amount = 0;
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

export const daysBetween = (start, end) => {
  if (!start || !end) return 0;
  const a = new Date(start);
  const b = new Date(end);
  const diff = Math.round((b - a) / 86400000);
  return Math.max(diff, 0);
};

export const minDate = () => new Date().toISOString().split("T")[0];
