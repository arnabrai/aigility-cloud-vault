
import React, { useState } from "react";
import AppSidebar from "@/components/Sidebar";
import ContentHeader from "@/components/ContentHeader";
import FileGrid from "@/components/FileGrid";
import FileList from "@/components/FileList";
import FileDetails from "@/components/FileDetails";
import { StorageItem } from "@/types/files";
import { 
  getAllItems, 
  getItemsByPath, 
  getFavoriteItems, 
  getSharedItems, 
  getRecentItems 
} from "@/services/mockDataService";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
  const { toast } = useToast();

  const getItems = () => {
    switch (currentPath) {
      case "/favorites":
        return getFavoriteItems();
      case "/shared":
        return getSharedItems();
      case "/recent":
        return getRecentItems();
      default:
        return getItemsByPath(currentPath);
    }
  };

  const filteredItems = getItems().filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedItem(null);
  };

  const handleItemSelect = (item: StorageItem) => {
    if (item.type === "folder") {
      // Navigate to folder
      setCurrentPath(item.path);
      toast({
        title: "Folder Opened",
        description: `Opened ${item.name}`,
      });
    } else {
      // Select file for preview
      setSelectedItem(item);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        <AppSidebar activePath={currentPath} onNavigate={handleNavigate} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-16 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold ml-4 text-vault-blue">Aigility Cloud Vault</h1>
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              <ContentHeader
                currentPath={currentPath}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onSearchChange={setSearchQuery}
              />
              
              <div className="flex-1 overflow-y-auto p-4">
                {filteredItems.length > 0 ? (
                  viewMode === "grid" ? (
                    <FileGrid items={filteredItems} onItemSelect={handleItemSelect} />
                  ) : (
                    <FileList items={filteredItems} onItemSelect={handleItemSelect} />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p className="text-xl font-medium mb-2">No files found</p>
                    <p className="text-sm">
                      {searchQuery
                        ? `No results found for "${searchQuery}"`
                        : "This folder is empty"}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {selectedItem && (
              <div className="w-80">
                <FileDetails
                  item={selectedItem}
                  onClose={() => setSelectedItem(null)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
