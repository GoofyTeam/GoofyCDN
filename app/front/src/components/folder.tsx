import React from "react";
import { EllipsisVertical, Folder, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import { Button } from "./ui/button";

interface FolderProps {
  folderName: string;
  folderId: string;
}

const FolderComponent: React.FC<FolderProps> = ({ folderName, folderId }) => {
  return (
    <div className="cursor-pointer group p-4 rounded-lg justify-between transition-colors duration-200 flex w-full max-w-60 gap-4 bg-gray-50 hover:bg-gray-100">
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
              <Button variant="destructive" className="w-full">
                <Trash strokeWidth={2} />
                Delete Folder
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default FolderComponent;
