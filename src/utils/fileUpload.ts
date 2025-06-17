
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface FileUploadResult {
  url: string;
  path: string;
}

export const uploadFileToStorage = async (file: File, folder: string = 'general'): Promise<FileUploadResult> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('vehicle-files')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('vehicle-files')
    .getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    path: filePath
  };
};

export const uploadMultipleFiles = async (files: File[], folder: string = 'general'): Promise<FileUploadResult[]> => {
  const uploadPromises = files.map(file => uploadFileToStorage(file, folder));
  return Promise.all(uploadPromises);
};

export const deleteFileFromStorage = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('vehicle-files')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};
