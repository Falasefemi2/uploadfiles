import * as React from "react";
import { Upload, FileUp, X } from "lucide-react";
import { useDriveStore } from "#/stores/driveStore";
import { api } from "#/lib/api";
import { useQueryClient } from "@tanstack/react-query";

export function UploadDropzone({ folderId }: { folderId: string | null }) {
  const qc = useQueryClient();
  const { addUpload, updateUpload } = useDriveStore();
  const [dragOver, setDragOver] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    for (const file of arr) {
      const tmpId = Math.random().toString(36).slice(2);
      addUpload({ id: tmpId, name: file.name, progress: 0, status: "uploading" });
      try {
        updateUpload(tmpId, { progress: 20 });
        const { fileId } = await api.initUpload(file.name, file.type, folderId, file.size);
        updateUpload(tmpId, { progress: 45 });
        await api.uploadBytes(fileId, file);
        updateUpload(tmpId, { progress: 80 });
        await api.completeUpload(fileId);
        updateUpload(tmpId, { progress: 100, status: "done" });
        qc.invalidateQueries({ queryKey: ["contents", folderId] });
        setTimeout(() => updateUpload(tmpId, { status: "done" }), 800);
      } catch (e: any) {
        updateUpload(tmpId, { status: "error", error: e.message || "Upload failed" });
      }
    }
  };

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={`relative flex items-center gap-4 rounded-2xl border-2 border-dashed bg-white p-4 transition-colors md:p-5 ${dragOver ? "border-[#2563EB] bg-[#F1F5FD]" : "border-[#E4ECFC]"}`}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white md:size-12">
          <Upload className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Drag & drop files here</p>
          <p className="text-xs leading-relaxed text-[#64748B]">or click to browse. Max 100MB per file. Stored in Supabase.</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="shrink-0 rounded-full bg-[#0F172A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1E293B] active:translate-y-px"
        >
          Browse files
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <UploadQueue />
    </>
  );
}

function UploadQueue() {
  const { uploads, removeUpload } = useDriveStore();
  if (uploads.length === 0) return null;
  return (
    <div className="mt-3 space-y-2">
      {uploads.map((u) => (
        <div key={u.id} className="flex items-center gap-3 rounded-xl border border-[#E4ECFC] bg-white px-3 py-2.5">
          <div className={`flex size-8 items-center justify-center rounded-lg ${u.status === "error" ? "bg-red-50 text-[#DC2626]" : u.status === "done" ? "bg-emerald-50 text-emerald-600" : "bg-[#F1F5FD] text-[#2563EB]"}`}>
            <FileUp className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{u.name}</p>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5FD]">
              <div
                className={`h-full rounded-full transition-all ${u.status === "error" ? "bg-[#DC2626]" : u.status === "done" ? "bg-emerald-500" : "bg-[#2563EB]"}`}
                style={{ width: `${u.progress}%` }}
              />
            </div>
            {u.status === "error" && <p className="mt-1 text-xs text-[#DC2626]">{u.error}</p>}
            {u.status === "done" && <p className="text-xs text-emerald-600">Uploaded & verified</p>}
          </div>
          <button onClick={() => removeUpload(u.id)} className="flex size-7 items-center justify-center rounded-full hover:bg-[#F1F5FD] text-[#94A3B8]">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
