
import React from "react";
import { 
  File, 
  FileImage, 
  FileText, 
  FileVideo, 
  FileAudio, 
  FileArchive, 
  Folder 
} from "lucide-react";
import { FileType } from "../types/files";

interface FileIconProps {
  fileType: FileType;
  extension?: string;
  size?: number;
  className?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ 
  fileType, 
  extension, 
  size = 24,
  className = ""
}) => {
  let IconComponent;

  switch (fileType) {
    case "folder":
      IconComponent = Folder;
      break;
    case "image":
      IconComponent = FileImage;
      break;
    case "document":
      IconComponent = FileText;
      break;
    case "video":
      IconComponent = FileVideo;
      break;
    case "audio":
      IconComponent = FileAudio;
      break;
    case "archive":
      IconComponent = FileArchive;
      break;
    default:
      IconComponent = File;
  }

  // Set color based on file type
  let color;
  switch (fileType) {
    case "folder":
      color = "#4f46e5"; // Indigo
      break;
    case "image":
      color = "#0ea5e9"; // Sky
      break;
    case "document":
      color = "#0d9488"; // Teal
      break;
    case "video":
      color = "#f59e0b"; // Amber
      break;
    case "audio":
      color = "#8b5cf6"; // Violet
      break;
    case "archive":
      color = "#f43f5e"; // Rose
      break;
    default:
      color = "#6b7280"; // Gray
  }

  return (
    <IconComponent size={size} color={color} className={className} />
  );
};

export default FileIcon;
