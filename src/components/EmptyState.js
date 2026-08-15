import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", description, action }) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="h-14 w-14 rounded-2xl bg-ink-50 flex items-center justify-center mb-4">
        <Icon className="h-7 w-7 text-ink-400" />
      </div>
      <h3 className="font-bold text-ink-900">{title}</h3>
      {description && <p className="text-sm text-ink-500 mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
