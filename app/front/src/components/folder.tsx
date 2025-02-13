import React from "react";
import { Folder } from "lucide-react";

interface FolderProps {
  folderName: string;
  onClick: () => void;
}

const FolderComponent: React.FC<FolderProps> = ({ folderName, onClick }) => {
  return (
    <div
      className="cursor-pointer p-4 rounded-lg transition-colors duration-200 flex flex-col w-full max-w-60 aspect-[5/4] bg-gray-200 hover:bg-gray-300"
      onClick={onClick}
    >
      <div className="h-8/10">
        <Folder strokeWidth={1} className="w-full h-full" />
      </div>
      <div className="h-2/10">
        <p>{folderName}</p>
      </div>
    </div>
  );
};

export default FolderComponent;
