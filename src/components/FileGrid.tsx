
import React from "react";
import FileCard from "./FileCard";
import { StorageItem } from "@/types/files";

interface FileGridProps {
  items: StorageItem[];
  onItemSelect: (item: StorageItem) => void;
}

const FileGrid: React.FC<FileGridProps> = ({ items, onItemSelect }) => {
  return (
    <div className="file-grid">
      {items.map((item) => (
        <FileCard key={item.id} item={item} onSelect={onItemSelect} />
      ))}
    </div>
  );
};

export default FileGrid;
