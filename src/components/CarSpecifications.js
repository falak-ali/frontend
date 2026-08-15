import { Gauge, Settings, Users, Fuel, Zap, Briefcase } from "lucide-react";

const specConfig = [
  { key: "engine", label: "Engine", icon: Gauge },
  { key: "transmission", label: "Transmission", icon: Settings },
  { key: "seats", label: "Seats", icon: Users },
  { key: "fuelType", label: "Fuel Type", icon: Fuel },
  { key: "acceleration", label: "0-100 KM/H", icon: Zap },
  { key: "storage", label: "Storage", icon: Briefcase },
];

export default function CarSpecifications({ car }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {specConfig.map(({ key, label, icon: Icon }) => (
        <div key={key} className="card p-4 flex flex-col gap-2">
          <span className="h-9 w-9 rounded-lg bg-primary-50 text-primary-800 flex items-center justify-center">
            <Icon className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-xs text-ink-500">{label}</p>
            <p className="text-sm font-semibold text-ink-900 mt-0.5">{car[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
