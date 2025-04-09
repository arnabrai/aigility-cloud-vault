import React, { useState } from "react";
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
  X, 
  CheckCircle,
  Link
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { deleteFile, downloadFile, getFileUrl, toggleFavorite, toggleShared } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";
import { File as FileType } from "@/types/supabase";

interface FileDetailsProps {
  item: StorageItem | null;
  onClose: () => void;
  onFileDeleted?: () => void;
}

const FileDetails: React.FC<FileDetailsProps> = ({ item, onClose, onFileDeleted }) => {
  const [isLoading, setIsLoading] = useState<{
    download: boolean;
    share: boolean;
    delete: boolean;
    favorite: boolean;
  }>({
    download: false,
    share: false,
    delete: false,
    favorite: false
  });
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const { toast } = useToast();

  if (!item) return null;

  const isFile = "size" in item;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  };

  const convertItemToFileType = (): FileType => {
    if (!isFile) throw new Error("Not a file item");
    
    const fileItem = item as FileItem;
    
    return {
      id: fileItem.id,
      name: fileItem.name,
      path: fileItem.path,
      size: fileItem.size,
      mime_type: fileItem.mimeType,
      folder_id: null,
      storage_path: `${window.localStorage.getItem('supabase.auth.token')?.user?.id}/${fileItem.path ? fileItem.path + '/' : ''}${fileItem.name}`,
      user_id: '',
      is_favorite: fileItem.favorite,
      is_shared: fileItem.shared,
      created_at: '',
      updated_at: ''
    };
  };

  const handleDownload = async () => {
    if (!isFile) return;
    
    setIsLoading(prev => ({ ...prev, download: true }));
    
    try {
      const fileData = convertItemToFileType();
      
      const blob = await downloadFile(fileData);
      
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
    } finally {
      setIsLoading(prev => ({ ...prev, download: false }));
    }
  };

  const handleShare = async () => {
    if (!isFile) return;
    
    setIsLoading(prev => ({ ...prev, share: true }));
    
    try {
      const fileData = convertItemToFileType();
      
      // Toggle shared status
      await toggleShared(fileData);
      
      // If now shared, get the URL
      if (!item.shared) {
        const url = await getFileUrl(fileData);
        setShareUrl(url);
        
        // Copy to clipboard
        if (url) {
          navigator.clipboard.writeText(url);
        }
      } else {
        setShareUrl(null);
      }
      
      toast({
        title: item.shared ? "Sharing disabled" : "File shared",
        description: item.shared 
          ? `${item.name} is no longer shared` 
          : `Share link for ${item.name} copied to clipboard`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to share file",
        description: error.message || "An error occurred while sharing the file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, share: false }));
    }
  };

  const handleDelete = async () => {
    if (!isFile) return;
    
    setIsLoading(prev => ({ ...prev, delete: true }));
    
    try {
      const fileData = convertItemToFileType();
      
      await deleteFile(fileData);
      
      toast({
        title: "File deleted",
        description: `${item.name} has been deleted successfully`,
      });
      
      if (onFileDeleted) {
        onFileDeleted();
      }
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Failed to delete file",
        description: error.message || "An error occurred while deleting the file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleToggleFavorite = async () => {
    if (!isFile) return;
    
    setIsLoading(prev => ({ ...prev, favorite: true }));
    
    try {
      const fileData = convertItemToFileType();
      
      await toggleFavorite(fileData);
      
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
    } finally {
      setIsLoading(prev => ({ ...prev, favorite: false }));
    }
  };

  const renderPreview = () => {
    if (!isFile) return <FileIcon fileType="folder" size={64} />;
    
    const fileItem = item as FileItem;
    
    if (fileItem.type === "image" && fileItem.thumbnail) {
      return (
        <img
          src={fileItem.thumbnail}
          alt={fileItem.name}
          className="max-h-48 max-w-full object-contain rounded-md"
        />
      );
    }
    
    if (fileItem.type === "document" && fileItem.mimeType === "application/pdf") {
      return (
        <iframe 
          src={fileItem.thumbnail} 
          className="w-full h-48 rounded-md"
          title={fileItem.name}
        />
      );
    }
    
    if (fileItem.type === "video") {
      return (
        <video 
          className="w-full max-h-48 rounded-md" 
          controls
          poster={fileItem.thumbnail}
        >
          <source src={fileItem.thumbnail} type={fileItem.mimeType} />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    if (fileItem.type === "audio") {
      return (
        <audio className="w-full mt-4" controls>
          <source src={fileItem.thumbnail} type={fileItem.mimeType} />
          Your browser does not support the audio tag.
        </audio>
      );
    }
    
    return <FileIcon fileType={fileItem.type} size={64} />;
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
          <div className="h-48 w-full flex items-center justify-center bg-gray-50 rounded-md">
            {renderPreview()}
          </div>
        </div>

        <h1 className="text-xl font-bold mb-2 text-center">{item.name}</h1>

        {shareUrl && (
          <div className="flex items-center p-2 mb-4 bg-vault-gray/20 rounded-md">
            <Link className="h-4 w-4 text-vault-teal mr-2" />
            <p className="text-sm text-vault-teal truncate flex-1">{shareUrl}</p>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}

        <div className="flex justify-center space-x-2 mb-6">
          <Button 
            variant="outline" 
            className="bg-white"
            onClick={handleDownload}
            disabled={!isFile || isLoading.download}
          >
            <Download className="w-4 h-4 mr-2" />
            {isLoading.download ? "Downloading..." : "Download"}
          </Button>
          <Button 
            variant="outline" 
            className={`bg-white ${item.shared ? "text-vault-teal border-vault-teal/30" : ""}`}
            onClick={handleShare}
            disabled={!isFile || isLoading.share}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isLoading.share ? "Processing..." : (item.shared ? "Unshare" : "Share")}
          </Button>
          <Button 
            variant="outline" 
            className="bg-white text-red-600 hover:text-red-700"
            onClick={handleDelete}
            disabled={!isFile || isLoading.delete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isLoading.delete ? "Deleting..." : "Delete"}
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-xs ${item.favorite ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white'}`}
                  onClick={handleToggleFavorite}
                  disabled={isLoading.favorite}
                >
                  <Heart 
                    className="h-3 w-3 mr-1" 
                    fill={item.favorite ? "currentColor" : "none"} 
                  />
                  Favorite
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-xs ${item.shared ? 'bg-vault-gray text-vault-teal border-vault-teal/30' : 'bg-white'}`}
                  onClick={handleShare}
                  disabled={isLoading.share}
                >
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
