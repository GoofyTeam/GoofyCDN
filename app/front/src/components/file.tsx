import React, { useEffect, useState } from "react";
import {
  Download,
  File as FileIcon,
  SquareArrowOutUpRight,
  Trash,
  Image,
  Video,
  FileText,
  Music,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import useAuth from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { useRouter } from "@tanstack/react-router";

interface FileProps {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  onClick?: () => void;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/"))
    return <Image strokeWidth={1} className="w-16 h-16" />;
  if (mimeType.startsWith("video/"))
    return <Video strokeWidth={1} className="w-16 h-16" />;
  if (mimeType === "application/pdf")
    return <FileText strokeWidth={1} className="w-16 h-16" />;
  if (mimeType.startsWith("audio/"))
    return <Music strokeWidth={1} className="w-16 h-16" />;
  return <FileIcon strokeWidth={1} className="w-16 h-16" />;
};

const FileComponent: React.FC<FileProps> = ({
  id,
  fileName,
  fileSize,
  mimeType,
  createdAt,
  onClick,
}) => {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

  const fetchFile = async () => {
    const file = await fetch(`http://localhost:8082/api/files/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!file.ok) {
      throw new Error("Erreur lors de la récupération du fichier");
    }
    const fileBlob = await file.blob();
    const fileUrl = URL.createObjectURL(fileBlob);
    setFileUrl(fileUrl);
  };

  useEffect(() => {
    if (isDialogOpen && id) {
      fetchFile();
    }
  }, [id, isDialogOpen]);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}
    >
      <DialogTrigger asChild>
        <div
          className="cursor-pointer p-4 rounded-lg transition-colors duration-200 flex flex-col w-full max-w-60 aspect-[5/4] bg-slate-50 hover:bg-gray-100"
          onClick={onClick}
        >
          <div className="flex-1 flex items-center justify-center">
            {getFileIcon(mimeType)}
          </div>
          <div className="mt-2">
            <p className="font-bold text-sm truncate">{fileName}</p>
            <p className="text-xs text-gray-600">{mimeType}</p>
            <p className="text-xs text-gray-600">{formatBytes(fileSize)}</p>
            <p className="text-xs text-gray-600">
              Créé le : {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fileName}</DialogTitle>
          <DialogDescription>
            Size : {formatBytes(fileSize)} | Type : {mimeType} | Created at :{" "}
            {new Date(createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        {fileUrl ? (
          <iframe
            src={fileUrl}
            width="100%"
            height="500px"
            title="File Viewer"
          ></iframe>
        ) : (
          <p>Chargement du fichier...</p>
        )}
        <div className="flex justify-end gap-2 mt-1">
          <Button variant="outline" asChild>
            <a href={fileUrl} target="_blank" rel="noreferrer">
              <SquareArrowOutUpRight /> Open in new tab
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (fileUrl) {
                const a = document.createElement("a");
                a.href = fileUrl;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(fileUrl);
              }
            }}
          >
            <Download /> Download
          </Button>
          <Button
            variant="outline"
            className="text-red-500"
            onClick={async () => {
              const response = await fetch(
                `http://localhost:8082/api/files/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );
              if (!response.ok) {
                throw new Error("Erreur lors de la suppression du fichier");
              }
              router.invalidate();
              setIsDialogOpen(false);
            }}
          >
            <Trash /> Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileComponent;
