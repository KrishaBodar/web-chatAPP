import { MessageCircle } from "lucide-react";

export default function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-soft">
        <MessageCircle size={22} />
      </div>
      {!compact && (
        <div>
          <p className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">LUMORA</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Premium chat</p>
        </div>
      )}
    </div>
  );
}
