import { create } from "zustand";

type Breadcrumb = { id: string | null; name: string };

type UploadItem = {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
};

type DriveState = {
  currentFolderId: string | null;
  breadcrumbs: Breadcrumb[];
  view: "grid" | "list";
  search: string;
  uploads: UploadItem[];
  // actions
  setCurrentFolder: (id: string | null, name?: string) => void;
  pushBreadcrumb: (id: string, name: string) => void;
  popTo: (index: number) => void;
  resetToRoot: () => void;
  setView: (v: "grid" | "list") => void;
  setSearch: (s: string) => void;
  addUpload: (item: UploadItem) => void;
  updateUpload: (id: string, patch: Partial<UploadItem>) => void;
  removeUpload: (id: string) => void;
  clearUploads: () => void;
};

export const useDriveStore = create<DriveState>((set, get) => ({
  currentFolderId: null,
  breadcrumbs: [{ id: null, name: "My Drive" }],
  view: "grid",
  search: "",
  uploads: [],

  setCurrentFolder: (id, name) =>
    set((s) => {
      // if navigating via breadcrumb, breadcrumbs already managed
      // direct set keeps breadcrumbs consistent if name provided
      if (name !== undefined) {
        const idx = s.breadcrumbs.findIndex((b) => b.id === id);
        if (idx !== -1) {
          return { currentFolderId: id, breadcrumbs: s.breadcrumbs.slice(0, idx + 1) };
        }
        // push if not found and not root
        if (id !== null) {
          return {
            currentFolderId: id,
            breadcrumbs: [...s.breadcrumbs, { id, name }],
          };
        }
      }
      return { currentFolderId: id };
    }),

  pushBreadcrumb: (id, name) =>
    set((s) => ({
      currentFolderId: id,
      breadcrumbs: [...s.breadcrumbs, { id, name }],
    })),

  popTo: (index) =>
    set((s) => {
      const b = s.breadcrumbs[index];
      return {
        currentFolderId: b.id,
        breadcrumbs: s.breadcrumbs.slice(0, index + 1),
      };
    }),

  resetToRoot: () =>
    set({
      currentFolderId: null,
      breadcrumbs: [{ id: null, name: "My Drive" }],
    }),

  setView: (view) => set({ view }),
  setSearch: (search) => set({ search }),

  addUpload: (item) => set((s) => ({ uploads: [...s.uploads, item] })),
  updateUpload: (id, patch) =>
    set((s) => ({
      uploads: s.uploads.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    })),
  removeUpload: (id) => set((s) => ({ uploads: s.uploads.filter((u) => u.id !== id) })),
  clearUploads: () => set({ uploads: [] }),
}));
