import { ChevronRight, Home } from "lucide-react";
import { useDriveStore } from "#/stores/driveStore";

export function Breadcrumb() {
  const { breadcrumbs, popTo } = useDriveStore();
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-2 text-sm">
      {breadcrumbs.map((b, i) => {
        const isLast = i === breadcrumbs.length - 1;
        return (
          <span key={`${b.id}-${i}`} className="flex items-center gap-1.5">
            {i !== 0 && <ChevronRight className="size-3.5 shrink-0 text-[#94A3B8]" />}
            <button
              onClick={() => popTo(i)}
              disabled={isLast}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm transition-colors ${
                isLast
                  ? "bg-[#0F172A] text-white"
                  : "bg-white text-[#0F172A] hover:bg-[#F1F5FD] border border-[#E4ECFC]"
              }`}
            >
              {i === 0 ? <Home className="size-3.5" /> : null}
              {b.name}
            </button>
          </span>
        );
      })}
    </div>
  );
}
