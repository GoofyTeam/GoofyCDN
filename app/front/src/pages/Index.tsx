import FolderComponent from "@/components/folder";
import { SiteHeader } from "@/components/header";
import React from "react";

const Index: React.FC = () => {
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
      </div>
    </div>
  );
};

export default Index;
