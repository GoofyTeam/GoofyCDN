import { FileExplorerLayout } from "@/pages/FileExplorerLayout";
import { createFileRoute } from "@tanstack/react-router";

interface FolderItem {
  id: string;

  name: string;
}

type FileObject = {
  id: string;
  name: string;
  path: string;
  size: number;
  mime_type: string;
  folder_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

//Routes to access specific folders and subfolders $folderPath is the PATH of the folder
export const Route = createFileRoute("/_authenticated/drive/$folderPath")({
  loader: async ({ context, params }) => {
    const userToken = context.auth.accessToken;
    const folderPath = params.folderPath;

    const folderData = await fetch(
      `http://localhost:8082/api/folders/${folderPath}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (!folderData.ok) {
      throw new Error("Erreur lors de la récupération des fichiers");
    }

    const filesData = await folderData.json();
    let {
      folders,
      files,
    }: {
      folders: FolderItem[];
      files: FileObject[];
    } = filesData;

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
