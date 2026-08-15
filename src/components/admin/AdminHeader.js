import { Menu, Bell, Search } from "lucide-react";

export default function AdminHeader({ title, subtitle, onMenuClick, actions }) {
  return (
    <header className="sticky top-0 z-[80] bg-white border-b border-ink-100 px-4 sm:px-6 py-3.5 flex items-center gap-3">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-ink-600 hover:bg-ink-50">
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl font-bold text-ink-900 leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-ink-500 mt-0.5 truncate">{subtitle}</p>}
      </div>

      {actions}

      <div className="hidden md:flex items-center relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
        <input
          type="text"
          placeholder="Search…"
          className="form-field pl-9 w-56 bg-ink-50 border-ink-100"
        />
      </div>

      <button className="relative p-2 rounded-lg text-ink-600 hover:bg-ink-50">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error-500" />
      </button>
    </header>
  );
}
