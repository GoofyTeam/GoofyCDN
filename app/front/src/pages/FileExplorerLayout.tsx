import FileComponent from "@/components/file";
import FolderComponent from "@/components/folder";

export const FileExplorerLayout = () => {
  return (
    <main className=" h-screen w-full">
      <div className="mb-4 ">
        <p className="font-semibold text-xl my-4">Folders</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
          <FolderComponent folderName="Dossier 1" onClick={() => {}} />
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
