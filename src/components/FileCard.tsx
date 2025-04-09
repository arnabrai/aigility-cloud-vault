
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatFileSize } from "@/services/mockDataService";
import FileIcon from "./FileIcon";
import { StorageItem } from "@/types/files";
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

interface FileCardProps {
  item: StorageItem;
  onSelect: (item: StorageItem) => void;
  onUpdate?: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ item, onSelect, onUpdate }) => {
  const { toast } = useToast();
  
  // Format last modified date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(item.lastModified);

  const isFile = "size" in item;

  const convertToFileType = (): FileType => {
    if (!isFile) throw new Error("Not a file");
    
    return {
      id: item.id,
      name: item.name,
      path: item.path,
      size: item.size,
      mime_type: item.mimeType,
      folder_id: null,
      storage_path: item.path.startsWith('/') ? item.path.slice(1) : item.path,
      user_id: '',
      is_favorite: item.favorite,
      is_shared: item.shared,
      created_at: '',
      updated_at: ''
    };
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    if (!isFile) return;
    e.stopPropagation();
    
    try {
      await toggleFavorite(convertToFileType());
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

  const handleToggleShare = async (e: React.MouseEvent) => {
    if (!isFile) return;
    e.stopPropagation();
    
    try {
      await toggleShared(convertToFileType());
      if (onUpdate) onUpdate();
      
      // If now shared, get the URL and copy to clipboard
      if (!item.shared) {
        const url = await getFileUrl(convertToFileType());
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

  const handleDownload = async (e: React.MouseEvent) => {
    if (!isFile) return;
    e.stopPropagation();
    
    try {
      const blob = await downloadFile(convertToFileType());
      
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
      toast({
        title: "Download failed",
        description: error.message || "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    if (!isFile) return;
    e.stopPropagation();
    
    try {
      await deleteFile(convertToFileType());
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
    <Card 
      className="file-card cursor-pointer group animate-fade-in hover:border-vault-teal"
      onClick={() => onSelect(item)}
    >
      <CardContent className="p-4">
        {/* File preview or icon */}
        <div className="flex justify-center items-center h-32 mb-2 bg-gray-50 rounded">
          {item.type === "image" && "thumbnail" in item && item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <FileIcon fileType={item.type} size={48} />
          )}
        </div>

        {/* File info */}
        <div className="mt-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium truncate max-w-[80%]" title={item.name}>
              {item.name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDownload}>Download</DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleShare}>
                  {item.shared ? "Disable sharing" : "Share"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleFavorite}>
                  {item.favorite ? "Remove from favorites" : "Add to favorites"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
            <span>{formattedDate}</span>
            {isFile && <span>{formatFileSize(item.size)}</span>}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleToggleFavorite}
            >
              <Heart 
                className="h-4 w-4" 
                fill={item.favorite ? "red" : "none"} 
                color={item.favorite ? "red" : "currentColor"} 
              />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${item.shared ? "text-vault-teal" : ""}`}
              onClick={handleToggleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileCard;
