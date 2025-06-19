import { supabase } from '@/integrations/supabase/client';
import { Device } from '@/utils/types';
import { mapSupabaseDeviceToDevice, mapDeviceToSupabaseDevice } from '@/utils/supabaseMappers';
import { uploadMultipleFiles, uploadFileToStorage } from '@/utils/fileUpload';

export const createDevice = async (deviceData: Partial<Device>, images: File[] = [], attachments: File[] = [], thumbnailFile?: File): Promise<Device> => {
  try {
    console.log('Creating device with files:', { images: images.length, attachments: attachments.length, thumbnailFile: !!thumbnailFile });
    
    // Upload files to storage
    const uploadedImages = images.length > 0 ? await uploadMultipleFiles(images, 'devices/images') : [];
    const uploadedAttachments = attachments.length > 0 ? await uploadMultipleFiles(attachments, 'devices/attachments') : [];
    const uploadedThumbnail = thumbnailFile ? await uploadFileToStorage(thumbnailFile, 'devices/thumbnails') : null;

    console.log('Files uploaded:', { uploadedImages, uploadedAttachments, uploadedThumbnail });

    // Prepare data for database
    const deviceForDb = mapDeviceToSupabaseDevice({
      ...deviceData,
      images: uploadedImages.map(img => img.url),
      attachments: uploadedAttachments.map((att, index) => ({
        name: attachments[index]?.name || '',
        type: attachments[index]?.type || '',
        size: attachments[index]?.size || 0,
        url: att.url
      })),
      thumbnail: uploadedThumbnail?.url || null,
    });

    const { data, error } = await supabase
      .from('devices')
      .insert([deviceForDb])
      .select()
      .single();

    if (error) {
      console.error('Error creating device:', error);
      throw new Error(`Failed to create device: ${error.message}`);
    }

    console.log('Device created successfully:', data);
    return mapSupabaseDeviceToDevice(data);
  } catch (error) {
    console.error('Error in createDevice:', error);
    throw error;
  }
};

export const updateDevice = async (
  id: string, 
  deviceData: Partial<Device>, 
  newImages: File[] = [], 
  newAttachments: File[] = [], 
  thumbnailFile?: File
): Promise<Device> => {
  try {
    console.log('Updating device with new files:', { newImages: newImages.length, newAttachments: newAttachments.length, thumbnailFile: !!thumbnailFile });
    
    // Get current device data
    const { data: currentDevice, error: fetchError } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch current device: ${fetchError.message}`);
    }

    // Upload new files
    const uploadedImages = newImages.length > 0 ? await uploadMultipleFiles(newImages, 'devices/images') : [];
    const uploadedAttachments = newAttachments.length > 0 ? await uploadMultipleFiles(newAttachments, 'devices/attachments') : [];
    const uploadedThumbnail = thumbnailFile ? await uploadFileToStorage(thumbnailFile, 'devices/thumbnails') : null;

    console.log('New files uploaded:', { uploadedImages, uploadedAttachments, uploadedThumbnail });

    // Combine existing and new files
    const existingImages: string[] = Array.isArray(deviceData.images) ? deviceData.images : 
                                   (Array.isArray(currentDevice.images) ? currentDevice.images as string[] : []);
    const existingAttachments: Array<{name: string; type: string; size: number; url: string}> = 
      Array.isArray(deviceData.attachments) ? deviceData.attachments : 
      (Array.isArray(currentDevice.attachments) ? currentDevice.attachments as Array<{name: string; type: string; size: number; url: string}> : []);
    
    const allImages: string[] = [...existingImages, ...uploadedImages.map(img => img.url)];
    const allAttachments: Array<{name: string; type: string; size: number; url: string}> = [
      ...existingAttachments,
      ...uploadedAttachments.map((att, index) => ({
        name: newAttachments[index]?.name || '',
        type: newAttachments[index]?.type || '',
        size: newAttachments[index]?.size || 0,
        url: att.url
      }))
    ];

    const deviceForDb = mapDeviceToSupabaseDevice({
      ...deviceData,
      images: allImages,
      attachments: allAttachments,
      thumbnail: uploadedThumbnail?.url || deviceData.thumbnail || currentDevice.thumbnail,
    });

    const { data, error } = await supabase
      .from('devices')
      .update(deviceForDb)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating device:', error);
      throw new Error(`Failed to update device: ${error.message}`);
    }

    console.log('Device updated successfully:', data);
    return mapSupabaseDeviceToDevice(data);
  } catch (error) {
    console.error('Error in updateDevice:', error);
    throw error;
  }
};

export const getAllDevices = async (): Promise<Device[]> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching devices:', error);
      throw new Error(`Failed to fetch devices: ${error.message}`);
    }

    return data.map(mapSupabaseDeviceToDevice);
  } catch (error) {
    console.error('Error in getAllDevices:', error);
    throw error;
  }
};

export const deleteDevice = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting device:', error);
      throw new Error(`Failed to delete device: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteDevice:', error);
    throw error;
  }
};
