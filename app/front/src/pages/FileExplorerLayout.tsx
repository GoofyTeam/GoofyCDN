import { useEffect, useState } from "react";
import FileComponent from "@/components/file";
import FolderComponent from "@/components/folder";
import useAuth from "@/hooks/useAuth";

interface FolderItem {
  id: string;
  name: string;
}

export const FileExplorerLayout = () => {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("http://localhost:8082/api/folders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des dossiers");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Les données reçues ne sont pas valides");
        }
        setFolders(data);
      } catch (error) {
        setError("Erreur lors de la récupération des dossiers");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [accessToken]);

  return (
    <main className=" h-screen w-full">
      <div className="mb-4 ">
        <p className="font-semibold text-xl my-4">Folders</p>
        {loading && <p>Chargement des dossiers...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && folders.length === 0 && (
          <p className="text-gray-500">Aucun dossier existant</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {folders.map((folder) => (
            <FolderComponent
              key={folder.id}
              folderName={folder.name}
              onClick={() => console.log(`Dossier ouvert: ${folder.name}`)}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="font-semibold text-xl my-4">Files</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          <FileComponent
            fileName="Fichier 1"
            onClick={() => {}}
            fileSize={0}
            mimeType={""}
            createdAt={""}
            updatedAt={""}
          />
          <FileComponent
            fileName="Fichier 1"
            onClick={() => {}}
            fileSize={0}
            mimeType={""}
            createdAt={""}
            updatedAt={""}
          />
          <FileComponent
            fileName="Fichier 1"
            onClick={() => {}}
            fileSize={0}
            mimeType={""}
            createdAt={""}
            updatedAt={""}
          />
          <FileComponent
            fileName="Fichier 1"
            onClick={() => {}}
            fileSize={0}
            mimeType={""}
            createdAt={""}
            updatedAt={""}
          />
          <FileComponent
            fileName="Fichier 1"
            onClick={() => {}}
            fileSize={0}
            mimeType={""}
            createdAt={""}
            updatedAt={""}
          />
          <FileComponent
            fileName="Fichier 1"
            onClick={() => {}}
            fileSize={0}
            mimeType={""}
            createdAt={""}
            updatedAt={""}
          />
          <FileComponent
            fileName="Fichier 1"
            onClick={() => {}}
            fileSize={0}
            mimeType={""}
            createdAt={""}
            updatedAt={""}
          />
          <FileComponent
            fileName="Fichier 1"
            onClick={() => {}}
            fileSize={0}
            mimeType={""}
            createdAt={""}
            updatedAt={""}
          />
          <FileComponent
            fileName="Fichier 1"
            onClick={() => {}}
            fileSize={0}
            mimeType={""}
            createdAt={""}
            updatedAt={""}
          />
          <FileComponent
            fileName="Fichier 1"
            onClick={() => {}}
            fileSize={0}
            mimeType={""}
            createdAt={""}
            updatedAt={""}
          />
        </div>
      </div>
    </main>
  );
};
