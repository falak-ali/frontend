import { X } from "lucide-react";
import { useEffect } from "react";

export default function AdminModal({ open, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const sizes = { sm: "sm:max-w-md", md: "sm:max-w-lg", lg: "sm:max-w-2xl", xl: "sm:max-w-4xl" };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative bg-white rounded-t-2xl sm:rounded-2xl shadow-lift w-full ${sizes[size]} max-h-[92vh] overflow-y-auto animate-fade-up`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-ink-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-ink-100 bg-ink-50/50 flex justify-end gap-2 sticky bottom-0">{footer}</div>}
      </div>
    </div>
  );
}
