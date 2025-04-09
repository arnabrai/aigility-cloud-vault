
import React from "react";
import FileCard from "./FileCard";
import { StorageItem } from "@/types/files";

interface FileGridProps {
  items: StorageItem[];
  onItemSelect: (item: StorageItem) => void;
  onUpdate?: () => void;
}

const FileGrid: React.FC<FileGridProps> = ({ items, onItemSelect, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <FileCard 
          key={item.id} 
          item={item} 
          onSelect={onItemSelect} 
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default FileGrid;
