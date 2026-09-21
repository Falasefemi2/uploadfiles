import { Plus, FolderPlus, Upload, HardDrive } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useDriveStore } from "#/stores/driveStore";
import { useMe, useContents } from "#/hooks/useDrive";

export function Sidebar({
  onCreateFolder,
  onUploadClick,
}: {
  onCreateFolder: () => void;
  onUploadClick: () => void;
}) {
  const { currentFolderId } = useDriveStore();
  const { data: me } = useMe();
  const { data } = useContents(currentFolderId);
  const fileCount = data?.files.length ?? 0;
  const folderCount = data?.folders.length ?? 0;

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[#E4ECFC] bg-white p-4 md:flex">
      <div className="mb-6">
        <div className="group relative">
          <Button
            onClick={onCreateFolder}
            className="h-11 w-full justify-start gap-3 rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] active:translate-y-px"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
              <Plus className="size-4" />
            </span>
            New
          </Button>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={onCreateFolder}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E4ECFC] bg-[#F8FAFC] py-2.5 text-xs font-medium text-[#0F172A] hover:bg-[#F1F5FD]"
            >
              <FolderPlus className="size-3.5 text-[#2563EB]" /> Folder
            </button>
            <button
              onClick={onUploadClick}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E4ECFC] bg-[#F8FAFC] py-2.5 text-xs font-medium text-[#0F172A] hover:bg-[#F1F5FD]"
            >
              <Upload className="size-3.5 text-[#D97706]" /> Upload
            </button>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        <a className="flex items-center gap-3 rounded-lg bg-[#F1F5FD] px-3 py-2 text-sm font-medium text-[#2563EB]">
          <HardDrive className="size-4" /> My Drive
          <span className="ml-auto text-xs font-normal text-[#64748B]">
            {folderCount + fileCount}
          </span>
        </a>
        <div className="px-3 py-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5FD]">
            <div className="h-full w-[32%] rounded-full bg-[#2563EB]" />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
            {fileCount} files • {folderCount} folders in this folder
          </p>
        </div>
      </nav>

      <div className="mt-auto rounded-xl border border-[#E4ECFC] bg-[#F8FAFC] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#D97706] text-white">
            <HardDrive className="size-4" />
          </div>
          Storage
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
          Direct to Supabase R2 via presigned uploads. Files are verified on complete.
        </p>
        {me ? (
          <p className="mt-3 truncate text-xs font-medium text-[#0F172A]">{me.email}</p>
        ) : null}
      </div>
    </aside>
  );
}
