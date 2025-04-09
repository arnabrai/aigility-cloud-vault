
export type FileType = 'image' | 'document' | 'video' | 'audio' | 'archive' | 'folder' | 'other';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  mimeType: string;
  extension: string;
  lastModified: Date;
  path: string;
  thumbnail?: string;
  favorite: boolean;
  shared: boolean;
}

export interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  path: string;
  lastModified: Date;
  favorite: boolean;
  shared: boolean;
}

export type StorageItem = FileItem | FolderItem;
