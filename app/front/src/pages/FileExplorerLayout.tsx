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

  const handleDeleteFolder = (folderId: string) => {
    const folderToDelete = folders.find((folder) => folder.id === folderId);
    router.invalidate();
    toast({
      title: "Delete Folder",
      description: `Folder ${folderToDelete?.name || ""} deleted successfully`,
      variant: "default",
    });
  };

  return (
    <main className=" h-screen w-full">
      <div className="mb-4 ">
        <p className="font-semibold text-xl my-4">Folders</p>
        {folders.length === 0 && (
          <p className="text-gray-500">Please create a folder first</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {folders.map((folder) => (
            <FolderComponent
              key={folder.id}
              folderName={folder.name}
              folderId={folder.id}
              onDelete={handleDeleteFolder}
            />
          ))}
        </div>
      </div>
      <div className={clsx("mb-4", { hidden: files.length === 0 })}>
        <p className="font-semibold text-xl my-4">Files</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {files.map((file) => (
            <FileComponent
              id={file.id}
              fileName={file.name}
              fileSize={file.size}
              mimeType={file.mime_type}
              createdAt={file.created_at}
              updatedAt={file.updated_at}
              key={
                file.id +
                file.name +
                file.size +
                file.mime_type +
                file.created_at +
                file.updated_at
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
};
