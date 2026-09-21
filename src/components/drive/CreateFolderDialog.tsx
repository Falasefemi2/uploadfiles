import * as React from "react";
import { Button } from "#/components/ui/button";
import { FolderPlus, X } from "lucide-react";

export function CreateFolderDialog({
  open,
  onOpenChange,
  onCreate,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (name: string) => void;
  isPending: boolean;
}) {
  const [name, setName] = React.useState("");
  React.useEffect(() => {
    if (!open) setName("");
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button aria-label="Close" onClick={() => onOpenChange(false)} className="absolute inset-0 bg-[#0F172A]/30 backdrop-blur-sm" />
      <div className="relative w-full max-w-[420px] rounded-2xl border border-[#E4ECFC] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#2563EB] text-white">
              <FolderPlus className="size-4" />
            </span>
            New folder
          </h2>
          <button onClick={() => onOpenChange(false)} className="flex size-8 items-center justify-center rounded-full hover:bg-[#F1F5FD] text-[#64748B]">
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#64748B]">Create a folder in the current location. Names must be unique per parent.</p>
        <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-[#64748B]">Folder name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) onCreate(name.trim());
            if (e.key === "Escape") onOpenChange(false);
          }}
          placeholder="e.g. Invoices 2026"
          className="mt-1.5 h-10 w-full rounded-xl border border-[#E4ECFC] bg-[#F8FAFC] px-3 text-sm focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
        />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            Cancel
          </Button>
          <Button
            onClick={() => onCreate(name.trim())}
            disabled={!name.trim() || isPending}
            className="rounded-full bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
