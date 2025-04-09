
import React from "react";
import { StorageItem, FileItem } from "@/types/files";
import FileIcon from "./FileIcon";
import { formatFileSize } from "@/services/mockDataService";
import { 
  Download, 
  Share2, 
  Trash2, 
  Calendar, 
  FileText, 
  File, 
  Heart, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FileDetailsProps {
  item: StorageItem | null;
  onClose: () => void;
}

const FileDetails: React.FC<FileDetailsProps> = ({ item, onClose }) => {
  if (!item) return null;

  const isFile = "size" in item;
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l animate-fade-in">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-medium">File Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-center mb-6">
          {item.type === "image" && isFile && (item as FileItem).thumbnail ? (
            <img
              src={(item as FileItem).thumbnail}
              alt={item.name}
              className="max-h-48 max-w-full object-contain rounded-md"
            />
          ) : (
            <div className="h-48 w-48 flex items-center justify-center bg-gray-50 rounded-md">
              <FileIcon fileType={item.type} size={64} />
            </div>
          )}
        </div>

        <h1 className="text-xl font-bold mb-2 text-center">{item.name}</h1>

        <div className="flex justify-center space-x-2 mb-6">
          <Button variant="outline" className="bg-white">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" className="bg-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="bg-white text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 mr-3 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Modified</h3>
              <p>{formatDate(item.lastModified)}</p>
            </div>
          </div>

          {isFile && (
            <div className="flex items-start">
              <FileText className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Size</h3>
                <p>{formatFileSize((item as FileItem).size)}</p>
              </div>
            </div>
          )}

          <div className="flex items-start">
            <File className="w-5 h-5 mr-3 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p>{isFile ? (item as FileItem).mimeType : "Folder"}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Heart className="w-5 h-5 mr-3 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="flex space-x-2 mt-1">
                <Button variant="outline" size="sm" className={`text-xs ${item.favorite ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white'}`}>
                  <Heart 
                    className="h-3 w-3 mr-1" 
                    fill={item.favorite ? "currentColor" : "none"} 
                  />
                  Favorite
                </Button>
                <Button variant="outline" size="sm" className={`text-xs ${item.shared ? 'bg-vault-gray text-vault-teal border-vault-teal/30' : 'bg-white'}`}>
                  <Share2 className="h-3 w-3 mr-1" />
                  Shared
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
