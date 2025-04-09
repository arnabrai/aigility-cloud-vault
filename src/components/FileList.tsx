
import React from "react";
import { StorageItem } from "@/types/files";
import FileIcon from "./FileIcon";
import { formatFileSize } from "@/services/mockDataService";
import { Heart, Share2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleFavorite, toggleShared, getFileUrl, deleteFile, downloadFile } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";
import { File as FileType } from "@/types/supabase";

interface FileListProps {
  items: StorageItem[];
  onItemSelect: (item: StorageItem) => void;
  onUpdate?: () => void;
}

const FileList: React.FC<FileListProps> = ({ items, onItemSelect, onUpdate }) => {
  const { toast } = useToast();
  
  // Format last modified date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const convertToFileType = (item: StorageItem): FileType => {
    if (!("size" in item)) throw new Error("Not a file");
    
    const fileItem = item as any;
    const storagePath = `${fileItem.path ? fileItem.path + '/' : ''}${fileItem.name}`;
    
    return {
      id: fileItem.id,
      name: fileItem.name,
      path: fileItem.path,
      size: fileItem.size,
      mime_type: fileItem.mimeType,
      folder_id: null,
      storage_path: storagePath,
      user_id: '',
      is_favorite: fileItem.favorite,
      is_shared: fileItem.shared,
      created_at: '',
      updated_at: ''
    };
  };

  const handleToggleFavorite = async (e: React.MouseEvent, item: StorageItem) => {
    if (!("size" in item)) return;
    e.stopPropagation();
    
    try {
      await toggleFavorite(convertToFileType(item));
      if (onUpdate) onUpdate();
      
      toast({
        title: item.favorite ? "Removed from favorites" : "Added to favorites",
        description: `${item.name} has been ${item.favorite ? "removed from" : "added to"} favorites`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to update favorite status",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleToggleShare = async (e: React.MouseEvent, item: StorageItem) => {
    if (!("size" in item)) return;
    e.stopPropagation();
    
    try {
      await toggleShared(convertToFileType(item));
      if (onUpdate) onUpdate();
      
      // If now shared, get the URL and copy to clipboard
      if (!item.shared) {
        const url = await getFileUrl(convertToFileType(item));
        if (url) {
          navigator.clipboard.writeText(url);
          toast({
            title: "File shared",
            description: `Share link for ${item.name} copied to clipboard`,
          });
        }
      } else {
        toast({
          title: "Sharing disabled",
          description: `${item.name} is no longer shared`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to share file",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (e: React.MouseEvent, item: StorageItem) => {
    if (!("size" in item)) return;
    e.stopPropagation();
    
    try {
      const blob = await downloadFile(convertToFileType(item));
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "File downloaded",
        description: `${item.name} has been downloaded successfully`,
      });
    } catch (error: any) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: error.message || "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent, item: StorageItem) => {
    if (!("size" in item)) return;
    e.stopPropagation();
    
    try {
      await deleteFile(convertToFileType(item));
      if (onUpdate) onUpdate();
      
      toast({
        title: "File deleted",
        description: `${item.name} has been deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete file",
        description: error.message || "An error occurred while deleting the file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b text-sm font-medium text-gray-600">
        <div className="col-span-6">Name</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-2">Modified</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      <div className="bg-white">
        {items.map((item) => {
          const isFile = "size" in item;
          
          return (
            <div
              key={item.id}
              onClick={() => onItemSelect(item)}
              className="grid grid-cols-12 gap-4 p-3 border-b hover:bg-gray-50 cursor-pointer items-center group animate-fade-in"
            >
              <div className="col-span-6 flex items-center">
                <FileIcon fileType={item.type} className="mr-3" />
                <span className="truncate">{item.name}</span>
                <div className="flex ml-2 space-x-1">
                  {item.favorite && (
                    <Heart size={14} className="text-red-500" fill="red" />
                  )}
                  {item.shared && (
                    <Share2 size={14} className="text-vault-teal" />
                  )}
                </div>
              </div>
              <div className="col-span-2 text-gray-500 text-sm">
                {isFile ? formatFileSize(item.size) : "--"}
              </div>
              <div className="col-span-2 text-gray-500 text-sm">
                {formatDate(item.lastModified)}
              </div>
              <div className="col-span-2 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isFile && (
                      <>
                        <DropdownMenuItem onClick={(e) => handleDownload(e, item)}>
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleToggleShare(e, item)}>
                          {item.shared ? "Disable sharing" : "Share"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleToggleFavorite(e, item)}>
                          {item.favorite ? "Remove from favorites" : "Add to favorites"}
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={(e) => handleDelete(e, item)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileList;
