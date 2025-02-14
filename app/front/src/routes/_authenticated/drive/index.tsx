import { FileExplorerLayout } from "@/pages/FileExplorerLayout";
import { createFileRoute } from "@tanstack/react-router";

interface FolderItem {
  id: string;
  name: string;
  // Ajoutez ici d'autres propriétés si nécessaire
}

interface FileObject {
  // Définissez ici les propriétés de vos fichiers
  id: string;
  name: string;
  // etc.
}

export const Route = createFileRoute("/_authenticated/drive/")({
  loader: async ({ context }) => {
    const userToken = context.auth.accessToken;

    // 1. Récupérer tous les dossiers
    const foldersResponse = await fetch("http://localhost:8082/api/folders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!foldersResponse.ok) {
      throw new Error("Erreur lors de la récupération des dossiers");
    }

    let foldersData: FolderItem[] = await foldersResponse.json();

    if (!Array.isArray(foldersData)) {
      foldersData = [];
    }

    console.log("Folders retrieved successfully:", foldersData);

    // 2. Trouver le dossier 'root'
    const rootFolder = foldersData.find((folder) => folder.name === "root");

    if (!rootFolder) {
      throw new Error("Le dossier root n'a pas été trouvé");
    }

    // 3. Faire l'appel vers l'API pour récupérer les fichiers du dossier root
    const folderDataResponse = await fetch(
      `http://localhost:8082/api/folders/${rootFolder.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!folderDataResponse.ok) {
      throw new Error("Erreur lors de la récupération des fichiers");
    }

    const folderData = await folderDataResponse.json();

    // Extraction des dossiers et fichiers de la réponse
    let { folders, files }: { folders: FolderItem[]; files: FileObject[] } =
      folderData;

    if (!Array.isArray(folders) || folders === null) {
      folders = [];
    }

    if (!Array.isArray(files) || files === null) {
      files = [];
    }

    return { folders, files };
  },
  component: FileExplorerLayout,
  gcTime: 0,
  shouldReload: false,
});
