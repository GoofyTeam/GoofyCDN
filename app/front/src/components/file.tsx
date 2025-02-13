import React from "react";
import { File as FileIcon } from "lucide-react";

interface FileProps {
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string; // ou Date, selon ce que vous recevez
  updatedAt: string;
  onClick: () => void;
}

// Fonction utilitaire pour formater la taille du fichier
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const FileComponent: React.FC<FileProps> = ({
  fileName,
  fileSize,
  mimeType,
  createdAt,
  onClick,
}) => {
  return (
    <div
      className="cursor-pointer p-4 rounded-lg transition-colors duration-200 flex flex-col w-full max-w-60 aspect-[5/4] bg-gray-200 hover:bg-gray-300"
      onClick={onClick}
    >
      <div className="flex-1 flex items-center justify-center">
        <FileIcon strokeWidth={1} className="w-16 h-16" />
      </div>
      <div className="mt-2">
        <p className="font-bold text-sm">{fileName}</p>
        <p className="text-xs text-gray-600">{mimeType}</p>
        <p className="text-xs text-gray-600">{formatBytes(fileSize)}</p>
        <p className="text-xs text-gray-600">
          Créé le : {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default FileComponent;
