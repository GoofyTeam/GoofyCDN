import { useState } from "react";
import FileComponent from "@/components/file";
import FolderComponent from "@/components/folder";
import { useToast } from "@/hooks/use-toast";
import {
  useLoaderData,
  useMatchRoute,
  useRouter,
} from "@tanstack/react-router";
import clsx from "clsx";

export const FileExplorerLayout = () => {
  const router = useRouter();
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: "/drive" });
  const { folders, files } = useLoaderData({
    from: params
      ? "/_authenticated/drive/"
      : "/_authenticated/drive/$folderPath",
  });
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteFolder = (folderId: string) => {
    const folderToDelete = folders.find((folder) => folder.id === folderId);
    router.invalidate();
    toast({
      title: "Delete Folder",
      description: `Folder ${folderToDelete?.name || ""} deleted successfully`,
      variant: "default",
    });
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="h-screen w-full">
      <div className="mb-4">
        <div className="flex justify-between items-center my-4">
          <p className="font-semibold text-xl">Folders & Files</p>
          <div className="relative w-full max-w-80">
            <input
              type="text"
              placeholder="Search folders and files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        {filteredFolders.length === 0 && filteredFiles.length === 0 && (
          <p className="text-gray-500">No folders or files found</p>
        )}
        {filteredFolders.length > 0 && (
          <>
            <p className="font-semibold text-xl my-4">Folders</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFolders.map((folder) => (
                <FolderComponent
                  key={folder.id}
                  folderName={folder.name}
                  onDelete={handleDeleteFolder}
                  folderId={folder.id}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className={clsx("mb-4", { hidden: filteredFiles.length === 0 })}>
        {filteredFiles.length > 0 && (
          <>
            <p className="font-semibold text-xl my-4">Files</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {filteredFiles.map((file) => (
                <FileComponent
                  id={file.id}
                  fileName={file.name}
                  fileSize={file.size}
                  mimeType={file.mime_type}
                  createdAt={file.created_at}
                  key={
                    file.id +
                    file.name +
                    file.size +
                    file.mime_type +
                    file.created_at
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};
