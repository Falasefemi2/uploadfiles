import * as React from "react";
import { Upload, FileUp, X } from "lucide-react";
import { useDriveStore } from "#/stores/driveStore";
import { api } from "#/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      } catch (e: any) {
        updateUpload(tmpId, { status: "error", error: e.message || "Upload failed" });
      }
    }
  };

  return (
    <>
      <Card
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
        className={`rounded-none border-dashed shadow-none ${dragOver ? "border-primary bg-muted" : "bg-card"}`}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center bg-primary text-primary-foreground">
            <Upload className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Drop files to upload</p>
            <p className="text-xs leading-relaxed text-muted-foreground">100MB per file • Verified via Supabase storage.</p>
          </div>
          <Button variant="outline" onClick={() => fileRef.current?.click()} className="shrink-0 rounded-none">
            Browse files
          </Button>
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
        </CardContent>
      </Card>
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
        <div key={u.id} className="flex items-center gap-3 border bg-card px-3 py-2">
          <div className={`flex size-7 items-center justify-center border ${u.status === "error" ? "bg-destructive/10 text-destructive" : u.status === "done" ? "bg-secondary" : "bg-secondary"}`}>
            <FileUp className="size-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{u.name}</p>
            <div className="mt-1 h-1 w-full bg-secondary">
              <div
                className={`h-full transition-all ${u.status === "error" ? "bg-destructive" : u.status === "done" ? "bg-primary" : "bg-primary"}`}
                style={{ width: `${u.progress}%` }}
              />
            </div>
            {u.status === "error" && <p className="mt-1 font-mono text-xs text-destructive">{u.error}</p>}
            {u.status === "done" && <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Verified</p>}
          </div>
          <Button variant="ghost" size="icon-xs" className="rounded-none" onClick={() => removeUpload(u.id)}>
            <X className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
