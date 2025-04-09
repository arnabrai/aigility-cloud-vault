
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

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      files: {
        Row: File;
        Insert: {
          created_at?: string | null;
          folder_id?: string | null;
          id?: string;
          is_favorite?: boolean | null;
          is_shared?: boolean | null;
          mime_type: string;
          name: string;
          path: string;
          size: number;
          storage_path: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          folder_id?: string | null;
          id?: string;
          is_favorite?: boolean | null;
          is_shared?: boolean | null;
          mime_type?: string;
          name?: string;
          path?: string;
          size?: number;
          storage_path?: string;
          updated_at?: string | null;
          user_id?: string;
        };
      };
      folders: {
        Row: Folder;
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          parent_id?: string | null;
          path: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          parent_id?: string | null;
          path?: string;
          updated_at?: string | null;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
