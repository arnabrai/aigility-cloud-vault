
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

interface FileListProps {
  items: StorageItem[];
  onItemSelect: (item: StorageItem) => void;
}

const FileList: React.FC<FileListProps> = ({ items, onItemSelect }) => {
  // Format last modified date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileList;
