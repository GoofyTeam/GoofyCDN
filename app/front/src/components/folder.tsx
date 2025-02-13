import React from "react";
import { EllipsisVertical, Folder, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import useAuth from "@/hooks/useAuth";

import { Button } from "./ui/button";

interface FolderProps {
  folderName: string;
  folderId: string;
  onDelete: (folderId: string) => void;
}

const FolderComponent: React.FC<FolderProps> = ({
  folderName,
  folderId,
  onDelete,
}) => {
  const { accessToken } = useAuth();
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8082/api/folders/${folderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du dossier");
      }
      onDelete(folderId);
    } catch (error) {
      console.error(error);
    }
  };

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
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
              >
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
