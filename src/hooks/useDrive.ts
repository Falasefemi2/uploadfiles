import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "#/lib/api";

export const qk = {
  me: ["me"] as const,
  contents: (folderId: string | null) => ["contents", folderId] as const,
};

export function useMe() {
  return useQuery({
    queryKey: qk.me,
    queryFn: () => api.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    // avoid SSR fetch without cookie — run only on client
    enabled: "window" in globalThis,
  });
}

export function useContents(folderId: string | null) {
  const { data: me } = useMe();
  return useQuery({
    queryKey: qk.contents(folderId),
    queryFn: () => api.listContents(folderId),
    staleTime: 15_000,
    enabled: !!me,
    retry: (count, err) => {
      // don't retry on 401
      if (err instanceof Error && err.message.includes("unauthorized")) return false;
      return count < 1;
    },
  });
}

export function useCreateFolder(folderId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.createFolder(name, folderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.contents(folderId) });
      if (folderId === null) qc.invalidateQueries({ queryKey: ["contents", null] });
    },
  });
}

export function useDeleteFolder(folderId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteFolder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.contents(folderId) }),
  });
}

export function useDeleteFile(folderId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteFile(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.contents(folderId) }),
  });
}

export function useUploadFile(folderId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => api.uploadFile(file, folderId),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.contents(folderId) }),
  });
}
