
import { supabase } from "@/integrations/supabase/client";
import { File, Folder } from "@/types/supabase";

const BUCKET_NAME = "files";

// File operations
export const uploadFile = async (
  file: globalThis.File,
  path: string,
  folderId: string | null = null
) => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    // Upload file to storage
    const fileName = file.name;
    const filePath = path ? `${path}/${fileName}` : fileName;
    const storagePath = `${user.id}/${filePath}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Insert file metadata into the database
    const { data: fileData, error: fileError } = await supabase
      .from("files")
      .insert({
        name: fileName,
        path: path,
        size: file.size,
        mime_type: file.type,
        folder_id: folderId,
        storage_path: storagePath,
        user_id: user.id,
      })
      .select()
      .single();

    if (fileError) throw fileError;
    
    return fileData;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const downloadFile = async (file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(file.storage_path);

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const deleteFile = async (file: File) => {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([file.storage_path]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from("files")
      .delete()
      .eq("id", file.id);

    if (dbError) throw dbError;
    
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const getFileUrl = async (file: File) => {
  const { data } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(file.storage_path, 60 * 60); // 1 hour expiry
  
  return data?.signedUrl;
};

// Folder operations
export const createFolder = async (
  name: string,
  path: string,
  parentId: string | null = null
) => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const folderPath = path ? `${path}/${name}` : name;
    
    const { data, error } = await supabase
      .from("folders")
      .insert({
        name,
        path: folderPath,
        parent_id: parentId,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

export const deleteFolder = async (folder: Folder) => {
  try {
    // Get all files in this folder
    const { data: files } = await supabase
      .from("files")
      .select("*")
      .eq("folder_id", folder.id);

    // Delete all files in this folder
    if (files && files.length > 0) {
      for (const file of files) {
        await deleteFile(file);
      }
    }

    // Get all subfolders
    const { data: subfolders } = await supabase
      .from("folders")
      .select("*")
      .eq("parent_id", folder.id);

    // Delete all subfolders recursively
    if (subfolders && subfolders.length > 0) {
      for (const subfolder of subfolders) {
        await deleteFolder(subfolder);
      }
    }

    // Delete the folder itself
    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", folder.id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};

// Fetch operations
export const getFilesAndFolders = async (path: string = "/") => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    // Get folders
    const { data: folders, error: foldersError } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", user.id)
      .eq("path", path);

    if (foldersError) throw foldersError;

    // Get files
    const { data: files, error: filesError } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", user.id)
      .eq("path", path);

    if (filesError) throw filesError;

    return { folders, files };
  } catch (error) {
    console.error("Error fetching files and folders:", error);
    throw error;
  }
};

export const toggleFavorite = async (file: File) => {
  try {
    const { data, error } = await supabase
      .from("files")
      .update({ is_favorite: !file.is_favorite })
      .eq("id", file.id)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

export const toggleShared = async (file: File) => {
  try {
    const { data, error } = await supabase
      .from("files")
      .update({ is_shared: !file.is_shared })
      .eq("id", file.id)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error toggling shared status:", error);
    throw error;
  }
};

export const getFavoriteFiles = async () => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_favorite", true);

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching favorite files:", error);
    throw error;
  }
};

export const getSharedFiles = async () => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_shared", true);

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching shared files:", error);
    throw error;
  }
};

export const getRecentFiles = async (limit: number = 10) => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching recent files:", error);
    throw error;
  }
};

export const getFileTypeFromMimeType = (mimeType: string): "image" | "document" | "video" | "audio" | "archive" | "other" => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType === "application/pdf" ||
    mimeType.includes("word") ||
    mimeType.includes("excel") ||
    mimeType.includes("powerpoint") ||
    mimeType.includes("text/")
  ) {
    return "document";
  }
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("tar") ||
    mimeType.includes("gzip") ||
    mimeType.includes("7z")
  ) {
    return "archive";
  }
  return "other";
};

export const convertToStorageItem = (file: File): any => {
  const extension = file.name.split('.').pop() || '';
  
  return {
    id: file.id,
    name: file.name,
    type: getFileTypeFromMimeType(file.mime_type),
    size: file.size,
    mimeType: file.mime_type,
    extension,
    lastModified: new Date(file.updated_at),
    path: file.path,
    favorite: file.is_favorite,
    shared: file.is_shared,
  };
};

export const convertFolderToStorageItem = (folder: Folder): any => {
  return {
    id: folder.id,
    name: folder.name,
    type: "folder",
    path: folder.path,
    lastModified: new Date(folder.updated_at),
    favorite: false,
    shared: false,
  };
};
