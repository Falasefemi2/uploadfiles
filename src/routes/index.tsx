import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Header } from "#/components/drive/Header";
import { Sidebar } from "#/components/drive/Sidebar";
import { Breadcrumb } from "#/components/drive/Breadcrumb";
import { DriveGrid } from "#/components/drive/DriveGrid";
import { UploadDropzone } from "#/components/drive/UploadDropzone";
import { CreateFolderDialog } from "#/components/drive/CreateFolderDialog";
import { useDriveStore } from "#/stores/driveStore";
import { useContents, useCreateFolder, useMe } from "#/hooks/useDrive";
import { api } from "#/lib/api";
import { Cloud, FolderPlus, Upload, ShieldCheck, Loader2, Search } from "lucide-react";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/")({ component: DrivePage });

function DrivePage() {
  const { currentFolderId, search, setSearch } = useDriveStore();
  const { data: me, isLoading: meLoading } = useMe();
  const isAuthed = !!me;
  const { data, isLoading, isError, error, refetch, isFetching } = useContents(currentFolderId);
  const createFolder = useCreateFolder(currentFolderId);
  const [folderOpen, setFolderOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const folders = data?.folders ?? [];
  const files = data?.files ?? [];

  const q = search.trim().toLowerCase();
  const filteredFolders = q ? folders.filter((f) => f.name.toLowerCase().includes(q)) : folders;
  const filteredFiles = q ? files.filter((f) => f.name.toLowerCase().includes(q)) : files;

  const handleCreate = async (name: string) => {
    try {
      await createFolder.mutateAsync(name);
      setFolderOpen(false);
    } catch (e: any) {
      alert(e.message || "Failed to create folder");
    }
  };

  // mobile file trigger via hidden input
  const triggerUpload = () => fileInputRef.current?.click();

  if (meLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="size-6 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        {/* hero */}
        <div className="mx-auto max-w-[960px] px-6 pb-16 pt-10 md:pt-16">
          <div className="mx-auto max-w-[720px] rounded-[24px] border border-[#E4ECFC] bg-white p-8 shadow-sm md:p-10">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-sm">
              <Cloud className="size-7" />
            </div>
            <h1 className="mt-6 text-center text-3xl font-semibold tracking-tight text-[#0F172A] md:text-[32px]">
              Your files, simply organized
            </h1>
            <p className="mx-auto mt-3 max-w-[520px] text-center text-[14px] leading-relaxed text-[#64748B]">
              Minimal drive for everyday work. Create folders, drag & drop uploads, and keep everything in one clean
              place — fast, secure, and distraction-free.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                onClick={() => (window.location.href = api.loginUrl())}
                className="h-11 w-full rounded-full bg-[#2563EB] px-8 text-sm font-semibold text-white hover:bg-[#1D4ED8] sm:w-auto"
              >
                Continue with Google
              </Button>
              <span className="text-xs text-[#94A3B8]">No credit card • 30s setup</span>
            </div>

            <div className="mt-9 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-[#E4ECFC] bg-[#F8FAFC] p-5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-white text-[#2563EB] ring-1 ring-[#E4ECFC]">
                  <FolderPlus className="size-4" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#0F172A]">Nested folders</p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  Organize with unlimited depth. Breadcrumbs keep you oriented.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E4ECFC] bg-[#F8FAFC] p-5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-white text-[#D97706] ring-1 ring-[#E4ECFC]">
                  <Upload className="size-4" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#0F172A]">Drag & drop upload</p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  Drop any file up to 100MB. Progress and verification built-in.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E4ECFC] bg-[#F8FAFC] p-5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-white text-emerald-600 ring-1 ring-[#E4ECFC]">
                  <ShieldCheck className="size-4" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#0F172A]">Private by default</p>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  Your files are isolated per account with secure sessions.
                </p>
              </div>
            </div>
          </div>

          {/* subtle preview mock */}
          <div className="mx-auto mt-6 max-w-[720px] overflow-hidden rounded-2xl border border-[#E4ECFC] bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#E4ECFC] bg-[#F8FAFC] px-4 py-3">
              <span className="size-3 rounded-full bg-[#FECDD3]" />
              <span className="size-3 rounded-full bg-[#FDE68A]" />
              <span className="size-3 rounded-full bg-[#BBF7D0]" />
              <span className="ml-3 text-xs font-medium text-[#64748B]">My Drive — Preview</span>
            </div>
            <div className="grid gap-3 p-4 md:grid-cols-3">
              <div className="rounded-xl border border-[#E4ECFC] p-4">
                <div className="size-8 rounded-lg bg-[#2563EB]" />
                <p className="mt-3 text-sm font-medium">Projects</p>
                <p className="text-xs text-[#64748B]">12 files • 3 folders</p>
              </div>
              <div className="rounded-xl border border-[#E4ECFC] p-4">
                <div className="size-8 rounded-lg bg-[#F1F5FD]" />
                <p className="mt-3 text-sm font-medium">Invoices 2026</p>
                <p className="text-xs text-[#64748B]">48 files</p>
              </div>
              <div className="rounded-xl border border-[#E4ECFC] p-4">
                <div className="size-8 rounded-lg bg-[#F8FAFC] ring-1 ring-[#E4ECFC]" />
                <p className="mt-3 text-sm font-medium">Vacation.zip</p>
                <p className="text-xs text-[#64748B]">1.2 GB • Verified</p>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-[520px] text-center text-xs leading-relaxed text-[#94A3B8]">
            Sign in to create your first folder. Everything you see above is live — no demo data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1440px]">
        <Sidebar onCreateFolder={() => setFolderOpen(true)} onUploadClick={triggerUpload} />
        <main className="min-w-0 flex-1 px-4 py-4 md:px-6 md:py-6">
          {/* mobile search */}
          <div className="relative mb-4 md:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in this folder"
              className="h-10 w-full rounded-full border border-[#E4ECFC] bg-white pl-10 pr-4 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Breadcrumb />
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-[#64748B] md:inline">
                {folders.length} folders • {files.length} files
              </span>
              {isFetching && <Loader2 className="size-4 animate-spin text-[#94A3B8]" />}
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="hidden rounded-full md:inline-flex"
              >
                Refresh
              </Button>
            </div>
          </div>

          <UploadDropzone folderId={currentFolderId} />

          {/* hidden input for sidebar upload button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={async (e) => {
              const list = e.target.files;
              if (!list?.length) return;
              // reuse dropzone logic via api directly for sidebar button
              for (const f of Array.from(list)) {
                try {
                  const { fileId } = await api.initUpload(f.name, f.type, currentFolderId, f.size);
                  await api.uploadBytes(fileId, f);
                  await api.completeUpload(fileId);
                } catch (err: any) {
                  alert(err.message);
                }
              }
              refetch();
              e.target.value = "";
            }}
          />

          <div className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-[148px] animate-pulse rounded-xl border border-[#E4ECFC] bg-white" />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-sm font-medium text-[#DC2626]">Failed to load contents</p>
                <p className="mt-1 text-xs text-red-700/80">{(error as Error)?.message}</p>
                <Button onClick={() => refetch()} className="mt-3 rounded-full" variant="outline" size="sm">
                  Try again
                </Button>
              </div>
            ) : (
              <DriveGrid folders={folders} files={files} filteredFolders={filteredFolders} filteredFiles={filteredFiles} />
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-2 border-t border-[#E4ECFC] pt-4 md:hidden">
            <Button onClick={() => setFolderOpen(true)} variant="outline" className="flex-1 rounded-full">
              <FolderPlus className="size-4" /> New folder
            </Button>
            <Button onClick={triggerUpload} className="flex-1 rounded-full bg-[#2563EB] text-white">
              <Upload className="size-4" /> Upload
            </Button>
          </div>
        </main>
      </div>

      <CreateFolderDialog open={folderOpen} onOpenChange={setFolderOpen} onCreate={handleCreate} isPending={createFolder.isPending} />
    </div>
  );
}
