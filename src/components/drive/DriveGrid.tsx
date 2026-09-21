import { Folder as FolderIcon, FileText, Image, Video, Music, Archive, Download, Trash2, File as FileIcon } from "lucide-react";
import { useDriveStore } from "#/stores/driveStore";
import type { Folder, FileItem } from "#/lib/api";
import { api } from "#/lib/api";
import { useDeleteFile, useDeleteFolder } from "#/hooks/useDrive";
import * as React from "react";

function formatBytes(b: number) {
  if (b === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${parseFloat((b / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function mimeIcon(mime: string, name: string) {
  if (mime.startsWith("image/")) return <Image className="size-5 text-[#D97706]" />;
  if (mime.startsWith("video/")) return <Video className="size-5 text-[#7C3AED]" />;
  if (mime.startsWith("audio/")) return <Music className="size-5 text-[#059669]" />;
  if (mime.includes("zip") || mime.includes("archive") || name.endsWith(".zip")) return <Archive className="size-5 text-[#64748B]" />;
  if (mime.includes("pdf")) return <FileText className="size-5 text-[#DC2626]" />;
  return <FileIcon className="size-5 text-[#64748B]" />;
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function DriveGrid({
  folders,
  files,
  filteredFolders,
  filteredFiles,
}: {
  folders: Folder[];
  files: FileItem[];
  filteredFolders: Folder[];
  filteredFiles: FileItem[];
}) {
  const { view, currentFolderId, setCurrentFolder } = useDriveStore();
  const delFolder = useDeleteFolder(currentFolderId);
  const delFile = useDeleteFile(currentFolderId);

  const [downloading, setDownloading] = React.useState<string | null>(null);

  const handleDownload = async (f: FileItem) => {
    try {
      setDownloading(f.id);
      await api.downloadFile(f.id, f.name);
    } catch (e: any) {
      alert(e.message || "Download failed");
    } finally {
      setDownloading(null);
    }
  };

  if (view === "list") {
    return (
      <div className="overflow-hidden rounded-xl border border-[#E4ECFC] bg-white">
        <div className="hidden grid-cols-[1fr_110px_110px_100px] gap-4 border-b border-[#E4ECFC] bg-[#F8FAFC] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#64748B] md:grid">
          <span>Name</span>
          <span>Size</span>
          <span>Modified</span>
          <span className="text-right">Actions</span>
        </div>

        {filteredFolders.map((f) => (
          <div
            key={f.id}
            className="group flex items-center gap-3 border-b border-[#F1F5FD] px-4 py-3 last:border-0 hover:bg-[#F8FAFC]"
          >
            <button
              onClick={() => setCurrentFolder(f.id, f.name)}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#F1F5FD] text-[#2563EB]">
                <FolderIcon className="size-5 fill-[#2563EB]/10" />
              </span>
              <span className="truncate text-sm font-medium">{f.name}</span>
              <span className="hidden rounded-full bg-[#F1F5FD] px-2 py-0.5 text-xs text-[#64748B] md:inline">Folder</span>
            </button>
            <span className="hidden w-[110px] text-xs text-[#64748B] md:block">—</span>
            <span className="hidden w-[110px] text-xs text-[#64748B] md:block">{timeAgo(f.createdAt)}</span>
            <div className="ml-auto flex items-center gap-1 md:w-[100px] md:justify-end">
              <button
                onClick={() => {
                  if (confirm(`Delete folder "${f.name}" and all contents?`)) delFolder.mutate(f.id);
                }}
                className="flex size-8 items-center justify-center rounded-full text-[#94A3B8] hover:bg-white hover:text-[#DC2626] border border-transparent hover:border-[#E4ECFC]"
                aria-label="Delete folder"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredFiles.map((f) => (
          <div
            key={f.id}
            className="group flex items-center gap-3 border-b border-[#F1F5FD] px-4 py-3 last:border-0 hover:bg-[#F8FAFC]"
          >
            <div className="flex flex-1 items-center gap-3 overflow-hidden">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-[#E4ECFC]">
                {mimeIcon(f.mimeType, f.name)}
              </span>
              <span className="truncate text-sm font-medium">{f.name}</span>
              {f.status !== "confirmed" && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                  {f.status}
                </span>
              )}
            </div>
            <span className="hidden w-[110px] shrink-0 text-xs text-[#64748B] md:block">{formatBytes(f.size)}</span>
            <span className="hidden w-[110px] shrink-0 text-xs text-[#64748B] md:block">{timeAgo(f.createdAt)}</span>
            <div className="ml-auto flex w-[100px] shrink-0 items-center justify-end gap-1">
              <button
                onClick={() => handleDownload(f)}
                disabled={downloading === f.id || f.status !== "confirmed"}
                className="flex size-8 items-center justify-center rounded-full border border-[#E4ECFC] bg-white text-[#2563EB] hover:bg-[#F1F5FD] disabled:opacity-40"
                aria-label="Download"
              >
                {downloading === f.id ? <span className="size-4 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent" /> : <Download className="size-4" />}
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete file "${f.name}"?`)) delFile.mutate(f.id);
                }}
                className="flex size-8 items-center justify-center rounded-full border border-transparent text-[#94A3B8] hover:border-[#E4ECFC] hover:bg-white hover:text-[#DC2626]"
                aria-label="Delete file"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredFolders.length === 0 && filteredFiles.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-[#64748B]">No items match your search</div>
        )}
      </div>
    );
  }

  // GRID
  return (
    <div className="space-y-8">
      {filteredFolders.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#64748B]">Folders</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredFolders.map((f) => (
              <div
                key={f.id}
                className="group relative flex flex-col rounded-xl border border-[#E4ECFC] bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
              >
                <button
                  onClick={() => setCurrentFolder(f.id, f.name)}
                  className="flex flex-1 flex-col text-left"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
                    <FolderIcon className="size-5 fill-white/20" />
                  </span>
                  <span className="mt-3 truncate text-sm font-medium">{f.name}</span>
                  <span className="text-xs text-[#94A3B8]">{timeAgo(f.createdAt)}</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete folder "${f.name}" and all contents?`)) delFolder.mutate(f.id);
                  }}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white text-[#94A3B8] opacity-0 shadow-sm ring-1 ring-[#E4ECFC] transition-opacity group-hover:opacity-100 hover:text-[#DC2626]"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#64748B]">Files</h3>
        {filteredFiles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E4ECFC] bg-white px-6 py-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#F1F5FD] text-[#2563EB]">
              <FileIcon className="size-6" />
            </div>
            <p className="mt-3 text-sm font-medium">No files here</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-[#64748B]">Upload files or drag and drop them onto the drop zone above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredFiles.map((f) => (
              <div
                key={f.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E4ECFC] bg-white transition-all hover:shadow-sm"
              >
                <div className="flex h-[112px] items-center justify-center bg-[#F8FAFC] group-hover:bg-[#F1F5FD]">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#E4ECFC]">
                    {mimeIcon(f.mimeType, f.name)}
                  </div>
                  {f.status !== "confirmed" && (
                    <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      {f.status}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium" title={f.name}>
                    {f.name}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {formatBytes(f.size)} • {timeAgo(f.createdAt)}
                  </p>
                  <div className="mt-3 flex gap-1.5">
                    <button
                      onClick={() => handleDownload(f)}
                      disabled={f.status !== "confirmed" || downloading === f.id}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0F172A] py-1.5 text-xs font-semibold text-white hover:bg-[#1E293B] disabled:opacity-40"
                    >
                      {downloading === f.id ? (
                        <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Download className="size-3.5" />
                      )}
                      Download
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${f.name}"?`)) delFile.mutate(f.id);
                      }}
                      className="flex size-7 items-center justify-center rounded-lg border border-[#E4ECFC] bg-white text-[#64748B] hover:text-[#DC2626]"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
