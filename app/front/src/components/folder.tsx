import React from "react";
import { EllipsisVertical, Folder } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

interface FolderProps {
  folderName: string;
  onClick: () => void;
}

const FolderComponent: React.FC<FolderProps> = ({ folderName, onClick }) => {
  return (
    <div
      className="cursor-pointer group p-4 rounded-lg justify-between transition-colors duration-200 flex w-full max-w-60 gap-4 bg-gray-200 hover:bg-gray-300"
      onClick={onClick}
    >
      <div>
        <Folder strokeWidth={1} />
      </div>
      <div>
        <p>{folderName}</p>
      </div>
      <div className="flex group-hover:bg-gray-300 bg-gray-200 hover:bg-gray-400 rounded-full transition-colors duration-200">
        <Popover>
          <PopoverTrigger>
            <EllipsisVertical strokeWidth={1} />
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <p>ajouter les action ici</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default FolderComponent;
