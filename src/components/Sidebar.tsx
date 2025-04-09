
import React from 'react';
import { 
  Clock, 
  Cloud, 
  FileHeart, 
  FolderSearch, 
  HardDrive, 
  Link, 
  Shield, 
  Trash2, 
  UserSquare 
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

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

const AppSidebar: React.FC<SidebarProps> = ({ activePath, onNavigate }) => {
  // Mock storage statistics
  const storageUsed = 3.2; // GB
  const storageTotal = 15; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;

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
    { path: "/security", label: "Security", icon: Shield },
    { path: "/account", label: "Account", icon: UserSquare },
  ];

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-vault-teal" />
          <h1 className="text-xl font-bold text-vault-blue">Aigility Vault</h1>
        </div>
        <Button 
          className="mt-4 w-full bg-vault-teal hover:bg-vault-blue text-white"
        >
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
                    onClick={() => onNavigate(item.path)}
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
                    onClick={() => onNavigate(item.path)}
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
                      activePath === item.path ? "bg-vault-gray text-vault-blue font-medium" : ""
                    }`}
                    onClick={() => onNavigate(item.path)}
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
          <span>{storageUsed} GB used</span>
          <span>{storageTotal} GB</span>
        </div>
        <Progress value={storagePercentage} className="h-2 bg-gray-200" />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
