
import React, { useState, useEffect } from "react";
import AppSidebar from "@/components/Sidebar";
import ContentHeader from "@/components/ContentHeader";
import FileGrid from "@/components/FileGrid";
import FileList from "@/components/FileList";
import FileDetails from "@/components/FileDetails";
import { StorageItem } from "@/types/files";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getFilesAndFolders, getFavoriteFiles, getSharedFiles, getRecentFiles, convertToStorageItem, convertFolderToStorageItem } from "@/services/storageService";
import { File, Folder } from "@/types/supabase";
import UploadDialog from "@/components/UploadDialog";
import CreateFolderDialog from "@/components/CreateFolderDialog";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
  const [items, setItems] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let fetchedItems: StorageItem[] = [];
      
      if (currentPath === "/favorites") {
        const favoriteFiles = await getFavoriteFiles();
        fetchedItems = favoriteFiles.map(convertToStorageItem);
      } else if (currentPath === "/shared") {
        const sharedFiles = await getSharedFiles();
        fetchedItems = sharedFiles.map(convertToStorageItem);
      } else if (currentPath === "/recent") {
        const recentFiles = await getRecentFiles(20);
        fetchedItems = recentFiles.map(convertToStorageItem);
      } else {
        const { folders, files } = await getFilesAndFolders(currentPath);
        
        fetchedItems = [
          ...folders.map(convertFolderToStorageItem),
          ...files.map(convertToStorageItem)
        ];
      }
      
      setItems(fetchedItems);
    } catch (error: any) {
      toast({
        title: "Error fetching files",
        description: error.message || "An error occurred while fetching your files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [currentPath, user]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'files'
        },
        () => {
          fetchItems();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'folders'
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentPath]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setCurrentFolderId(null);
    setSelectedItem(null);
  };

  const handleItemSelect = (item: StorageItem) => {
    if (item.type === "folder") {
      // Navigate to folder
      const newPath = item.path;
      setCurrentPath(newPath);
      setCurrentFolderId(item.id);
      setSelectedItem(null);
      toast({
        title: "Folder Opened",
        description: `Opened ${item.name}`,
      });
    } else {
      // Select file for preview
      setSelectedItem(item);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                onUploadClick={() => setUploadDialogOpen(true)}
                onNewFolderClick={() => setCreateFolderDialogOpen(true)}
              />
              
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                ) : filteredItems.length > 0 ? (
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
      
      <UploadDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        currentPath={currentPath}
        currentFolderId={currentFolderId}
        onUploadComplete={fetchItems}
      />
      
      <CreateFolderDialog
        isOpen={createFolderDialogOpen}
        onClose={() => setCreateFolderDialogOpen(false)}
        currentPath={currentPath}
        parentId={currentFolderId}
        onFolderCreated={fetchItems}
      />
    </SidebarProvider>
  );
};

export default Dashboard;
