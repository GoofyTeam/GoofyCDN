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
      className="cursor-pointer group p-4 rounded-lg justify-between transition-colors duration-200 flex w-full max-w-60 gap-4 bg-gray-50 hover:bg-gray-100"
      onClick={onClick}
    >
      <div>
        <Folder strokeWidth={1} />
      </div>
      <div>
        <p className="whitespace-nowrap">{folderName}</p>
      </div>
      <div className="flex  group-hover:bg-gray-100 bg-gray-50 hover:bg-gray-300 rounded-full transition-colors duration-200">
        <Popover>
          <PopoverTrigger className="cursor-pointer">
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
