
import { FileItem, FolderItem } from "../types/files";

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Create mock folders
const mockFolders: FolderItem[] = [
  {
    id: generateId(),
    name: "Documents",
    type: "folder",
    path: "/Documents",
    lastModified: new Date(2025, 2, 15),
    favorite: true,
    shared: false
  },
  {
    id: generateId(),
    name: "Photos",
    type: "folder",
    path: "/Photos",
    lastModified: new Date(2025, 3, 1),
    favorite: false,
    shared: true
  },
  {
    id: generateId(),
    name: "Videos",
    type: "folder",
    path: "/Videos",
    lastModified: new Date(2025, 3, 5),
    favorite: false,
    shared: false
  },
  {
    id: generateId(),
    name: "Work Projects",
    type: "folder",
    path: "/Work Projects",
    lastModified: new Date(2025, 3, 8),
    favorite: true,
    shared: true
  }
];

// Create mock files
const mockFiles: FileItem[] = [
  {
    id: generateId(),
    name: "Budget 2025.xlsx",
    type: "document",
    size: 1540000,
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extension: "xlsx",
    lastModified: new Date(2025, 3, 7),
    path: "/",
    favorite: false,
    shared: false
  },
  {
    id: generateId(),
    name: "Project Presentation.pptx",
    type: "document",
    size: 3200000,
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    extension: "pptx",
    lastModified: new Date(2025, 3, 5),
    path: "/",
    favorite: true,
    shared: true
  },
  {
    id: generateId(),
    name: "Meeting Notes.docx",
    type: "document",
    size: 890000,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extension: "docx",
    lastModified: new Date(2025, 3, 2),
    path: "/",
    favorite: false,
    shared: false
  },
  {
    id: generateId(),
    name: "Vacation Photo.jpg",
    type: "image",
    size: 2700000,
    mimeType: "image/jpeg",
    extension: "jpg",
    lastModified: new Date(2025, 2, 20),
    path: "/",
    thumbnail: "/placeholder.svg",
    favorite: true,
    shared: false
  },
  {
    id: generateId(),
    name: "Company Logo.png",
    type: "image",
    size: 1200000,
    mimeType: "image/png",
    extension: "png",
    lastModified: new Date(2025, 3, 8),
    path: "/",
    thumbnail: "/placeholder.svg",
    favorite: false,
    shared: true
  },
  {
    id: generateId(),
    name: "Product Demo.mp4",
    type: "video",
    size: 15400000,
    mimeType: "video/mp4",
    extension: "mp4",
    lastModified: new Date(2025, 3, 6),
    path: "/",
    favorite: false,
    shared: true
  },
  {
    id: generateId(),
    name: "Quarterly Report.pdf",
    type: "document",
    size: 4300000,
    mimeType: "application/pdf",
    extension: "pdf",
    lastModified: new Date(2025, 3, 1),
    path: "/",
    favorite: true,
    shared: false
  },
  {
    id: generateId(),
    name: "Archive.zip",
    type: "archive",
    size: 8900000,
    mimeType: "application/zip",
    extension: "zip",
    lastModified: new Date(2025, 2, 25),
    path: "/",
    favorite: false,
    shared: false
  }
];

// Export a function to get all items
export const getAllItems = () => {
  return [...mockFolders, ...mockFiles];
};

// Export a function to get items by path
export const getItemsByPath = (path: string) => {
  return getAllItems().filter(item => item.path === path);
};

// Export a function to get favorite items
export const getFavoriteItems = () => {
  return getAllItems().filter(item => item.favorite);
};

// Export a function to get shared items
export const getSharedItems = () => {
  return getAllItems().filter(item => item.shared);
};

export const getRecentItems = () => {
  // Sort all items by lastModified and get top 8
  return [...getAllItems()].sort((a, b) => 
    b.lastModified.getTime() - a.lastModified.getTime()
  ).slice(0, 8);
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
