import { Search, LogOut, Cloud, Grid3X3, List, Loader2 } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useMe } from "#/hooks/useDrive";
import { api } from "#/lib/api";
import { useDriveStore } from "#/stores/driveStore";

export function Header() {
  const { data: me, isLoading: meLoading } = useMe();
  const { search, setSearch, view, setView } = useDriveStore();

  return (
    <header className="sticky top-0 z-30 flex h-[56px] items-center gap-3 border-b border-[#E4ECFC] bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#2563EB] text-white">
          <Cloud className="size-5" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight">Drive</span>
        <span className="hidden rounded-full bg-[#F1F5FD] px-2 py-0.5 text-[11px] font-medium text-[#2563EB] md:inline-flex">Clone</span>
      </div>

      <div className="mx-4 hidden flex-1 justify-center md:flex">
        <div className="relative w-full max-w-[560px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search in Drive"
            className="h-9 w-full rounded-full border border-[#E4ECFC] bg-[#F8FAFC] pl-10 pr-4 text-sm placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center rounded-full border border-[#E4ECFC] p-1 md:flex">
          <button
            aria-label="Grid view"
            onClick={() => setView("grid")}
            className={`flex size-7 items-center justify-center rounded-full transition-colors ${view === "grid" ? "bg-[#2563EB] text-white" : "text-[#64748B] hover:bg-[#F1F5FD]"}`}
          >
            <Grid3X3 className="size-3.5" />
          </button>
          <button
            aria-label="List view"
            onClick={() => setView("list")}
            className={`flex size-7 items-center justify-center rounded-full transition-colors ${view === "list" ? "bg-[#2563EB] text-white" : "text-[#64748B] hover:bg-[#F1F5FD]"}`}
          >
            <List className="size-3.5" />
          </button>
        </div>

        {meLoading ? (
          <Loader2 className="size-4 animate-spin text-[#64748B]" />
        ) : !me ? (
          <Button
            size="sm"
            onClick={() => (window.location.href = api.loginUrl())}
            className="bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
          >
            Sign in with Google
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium leading-none">{me.name}</p>
              <p className="text-xs text-[#64748B]">{me.email}</p>
            </div>
            {me.avatarUrl ? (
              <img src={me.avatarUrl} alt={me.name} className="size-8 rounded-full object-cover ring-2 ring-[#E4ECFC]" />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
                {me.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={async () => {
                await api.logout().catch(() => {});
                window.location.reload();
              }}
              className="flex size-8 items-center justify-center rounded-full border border-[#E4ECFC] text-[#64748B] hover:bg-[#F1F5FD] hover:text-[#0F172A]"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
