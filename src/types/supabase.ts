
export type Folder = {
  id: string;
  name: string;
  path: string;
  parent_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type File = {
  id: string;
  name: string;
  path: string;
  size: number;
  mime_type: string;
  folder_id: string | null;
  storage_path: string;
  user_id: string;
  is_favorite: boolean;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
};
