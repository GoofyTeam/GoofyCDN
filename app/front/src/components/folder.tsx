import React from "react";
import { EllipsisVertical, Folder, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import useAuth from "@/hooks/useAuth";

import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

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
    <div className="cursor-pointer group py-4 px-2 rounded-lg justify-between transition-colors duration-200 flex w-full gap-2 bg-gray-50 hover:bg-gray-100 ">
      <Link
        /* @ts-expect-error - tanstack il sait pas mais nous on se sait */
        to={`/drive/${folderId}`}
        className="flex w-full gap-2"
      >
        <div>
          <Folder strokeWidth={1} />
        </div>
        <div className="overflow-hidden max-w-xs w-full">
          <p className="whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {folderName}
          </p>
        </div>
      </Link>
      <div className="flex  group-hover:bg-gray-100 bg-gray-50 hover:bg-gray-300 rounded-full transition-colors duration-200">
        <Popover>
          <PopoverTrigger className="cursor-pointer">
            <EllipsisVertical strokeWidth={1} />
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <Button
                variant="destructive"
                className="w-full cursor-pointer"
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
