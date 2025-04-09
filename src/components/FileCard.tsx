
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

interface FileCardProps {
  item: StorageItem;
  onSelect: (item: StorageItem) => void;
}

const FileCard: React.FC<FileCardProps> = ({ item, onSelect }) => {
  // Format last modified date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(item.lastModified);

  const isFile = "size" in item;

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
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Download</DropdownMenuItem>
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
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
              onClick={(e) => {
                e.stopPropagation();
                // Toggle favorite logic would go here
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                // Toggle share logic would go here
              }}
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
