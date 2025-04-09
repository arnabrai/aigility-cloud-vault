
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LayoutGrid, 
  List, 
  Search, 
  Upload, 
  FolderPlus 
} from "lucide-react";

interface ContentHeaderProps {
  currentPath: string;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onSearchChange: (query: string) => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  currentPath,
  viewMode,
  onViewModeChange,
  onSearchChange,
}) => {
  const pathParts = currentPath.split("/").filter(Boolean);
  const title = pathParts.length > 0 ? pathParts[pathParts.length - 1] : "My Files";

  return (
    <div className="p-4 border-b">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vault-blue">{title}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-white">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button className="bg-vault-teal hover:bg-vault-blue text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search files and folders..."
            className="pl-10 bg-white"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex border rounded-md overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            className={`px-3 ${
              viewMode === "grid" ? "bg-vault-gray text-vault-blue" : "bg-white"
            }`}
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`px-3 ${
              viewMode === "list" ? "bg-vault-gray text-vault-blue" : "bg-white"
            }`}
            onClick={() => onViewModeChange("list")}
          >
            <List size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
