import { FileExplorerLayout } from "@/pages/FileExplorerLayout";
import { createFileRoute } from "@tanstack/react-router";

interface FolderItem {
  id: string;
  name: string;
}

export const Route = createFileRoute("/_authenticated/drive/")({
  loader: async ({ context }) => {
    const userToken = context.auth.accessToken;
    const folders = await fetch("http://localhost:8082/api/folders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!folders.ok) {
      throw new Error("Erreur lors de la récupération des dossiers");
    }

    let data: FolderItem[] = await folders.json();

    if (!Array.isArray(data)) {
      data = [];
    }

    return { folders: data, files: [] };
  },
  component: FileExplorerLayout,
  gcTime: 0,
  shouldReload: false,
});
