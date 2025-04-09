
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Cloud, 
  FileHeart, 
  FolderSearch, 
  HardDrive, 
  Link, 
  Shield, 
  Trash2, 
  UserSquare,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
  onUploadClick?: () => void;
}

const AppSidebar: React.FC<SidebarProps> = ({ activePath, onNavigate, onUploadClick }) => {
  // Storage statistics
  const [storageUsed, setStorageUsed] = useState(0); // in MB
  const storageTotal = 1024; // 1GB in MB
  const [storagePercentage, setStoragePercentage] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStorageUsage = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('files')
          .select('size')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Calculate total size in MB
        const totalSizeInBytes = data.reduce((sum, file) => sum + file.size, 0);
        const totalSizeInMB = totalSizeInBytes / (1024 * 1024);
        
        setStorageUsed(parseFloat(totalSizeInMB.toFixed(2)));
        setStoragePercentage((totalSizeInMB / storageTotal) * 100);
      } catch (error) {
        console.error("Error fetching storage usage:", error);
      }
    };
    
    fetchStorageUsage();
    
    // Set up real-time subscription for file changes
    if (user) {
      const channel = supabase
        .channel('storage-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'files'
          },
          () => {
            fetchStorageUsage();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const menuItems = [
    { path: "/", label: "My Files", icon: Cloud },
    { path: "/recent", label: "Recent", icon: Clock },
    { path: "/favorites", label: "Favorites", icon: FileHeart },
    { path: "/shared", label: "Shared", icon: Link },
  ];
  
  const libraryItems = [
    { path: "/photos", label: "Photos", icon: FileHeart },
    { path: "/documents", label: "Documents", icon: FolderSearch },
  ];

  const utilityItems = [
    { path: "/trash", label: "Trash", icon: Trash2 },
    { path: "/security", label: "Security", icon: Shield, route: true },
    { path: "/account", label: "Account", icon: UserSquare, route: true },
  ];

  const handleItemClick = (item: any) => {
    if (item.route) {
      navigate(item.path);
    } else {
      onNavigate(item.path);
    }
  };

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-vault-teal" />
          <h1 className="text-xl font-bold text-vault-blue">Aigility Vault</h1>
        </div>
        <Button 
          className="mt-4 w-full bg-vault-teal hover:bg-vault-blue text-white"
          onClick={onUploadClick}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={`${
                      activePath === item.path ? "bg-vault-gray text-vault-blue font-medium" : ""
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel>Libraries</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={`${
                      activePath === item.path ? "bg-vault-gray text-vault-blue font-medium" : ""
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel>Utilities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={`${
                      (item.route ? window.location.pathname : activePath) === item.path ? "bg-vault-gray text-vault-blue font-medium" : ""
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex items-center mb-2">
          <HardDrive className="w-5 h-5 mr-2 text-vault-darkgray" />
          <span className="text-sm text-vault-darkgray">Storage</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>{storageUsed} MB used</span>
          <span>{storageTotal} MB</span>
        </div>
        <Progress value={storagePercentage} className="h-2 bg-gray-200" />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
