import FolderComponent from "@/components/folder";
import { SiteHeader } from "@/components/header";
import React from "react";
import FileComponent from "@/components/file";

const Index: React.FC = () => {
  const fileData = {
    fileName: "document.pdf",
    fileSize: 102400, // taille en octets
    mimeType: "application/pdf",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleFileClick = () => {
    console.log("Le fichier a été cliqué !");
    // Vous pouvez ajouter ici la logique pour ouvrir le fichier, le télécharger, etc.
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="p-4">
        <FolderComponent
          folderName="Documents"
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <FileComponent
          fileName={fileData.fileName}
          fileSize={fileData.fileSize}
          mimeType={fileData.mimeType}
          createdAt={fileData.createdAt}
          updatedAt={fileData.updatedAt}
          onClick={handleFileClick}
        />
      </div>
    </div>
  );
};

export default Index;
