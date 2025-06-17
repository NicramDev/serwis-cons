
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/utils/types';
import { mapSupabaseVehicleToVehicle, mapVehicleToSupabaseVehicle } from '@/utils/supabaseMappers';
import { uploadMultipleFiles, uploadFileToStorage, deleteFileFromStorage } from '@/utils/fileUpload';

export const createVehicle = async (vehicleData: Partial<Vehicle>, images: File[] = [], attachments: File[] = [], thumbnailFile?: File): Promise<Vehicle> => {
  try {
    // Upload files to storage
    const uploadedImages = images.length > 0 ? await uploadMultipleFiles(images, 'vehicles/images') : [];
    const uploadedAttachments = attachments.length > 0 ? await uploadMultipleFiles(attachments, 'vehicles/attachments') : [];
    const uploadedThumbnail = thumbnailFile ? await uploadFileToStorage(thumbnailFile, 'vehicles/thumbnails') : null;

    // Prepare data for database
    const vehicleForDb = mapVehicleToSupabaseVehicle({
      ...vehicleData,
      images: uploadedImages.map(img => img.url),
      attachments: uploadedAttachments.map(att => ({
        name: attachments[uploadedAttachments.indexOf(att)]?.name || '',
        type: attachments[uploadedAttachments.indexOf(att)]?.type || '',
        size: attachments[uploadedAttachments.indexOf(att)]?.size || 0,
        url: att.url
      })),
      thumbnail: uploadedThumbnail?.url || null,
    });

    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicleForDb])
      .select()
      .single();

    if (error) {
      console.error('Error creating vehicle:', error);
      throw new Error(`Failed to create vehicle: ${error.message}`);
    }

    return mapSupabaseVehicleToVehicle(data);
  } catch (error) {
    console.error('Error in createVehicle:', error);
    throw error;
  }
};

export const updateVehicle = async (
  id: string, 
  vehicleData: Partial<Vehicle>, 
  newImages: File[] = [], 
  newAttachments: File[] = [], 
  thumbnailFile?: File
): Promise<Vehicle> => {
  try {
    // Get current vehicle data
    const { data: currentVehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch current vehicle: ${fetchError.message}`);
    }

    // Upload new files
    const uploadedImages = newImages.length > 0 ? await uploadMultipleFiles(newImages, 'vehicles/images') : [];
    const uploadedAttachments = newAttachments.length > 0 ? await uploadMultipleFiles(newAttachments, 'vehicles/attachments') : [];
    const uploadedThumbnail = thumbnailFile ? await uploadFileToStorage(thumbnailFile, 'vehicles/thumbnails') : null;

    // Safely handle existing files - ensure they are arrays
    const existingImages = Array.isArray(vehicleData.images) ? vehicleData.images : 
                          Array.isArray(currentVehicle.images) ? currentVehicle.images : [];
    const existingAttachments = Array.isArray(vehicleData.attachments) ? vehicleData.attachments : 
                               Array.isArray(currentVehicle.attachments) ? currentVehicle.attachments : [];
    
    const allImages = [...existingImages, ...uploadedImages.map(img => img.url)];
    const allAttachments = [
      ...existingAttachments,
      ...uploadedAttachments.map((att, index) => ({
        name: newAttachments[index]?.name || '',
        type: newAttachments[index]?.type || '',
        size: newAttachments[index]?.size || 0,
        url: att.url
      }))
    ];

    const vehicleForDb = mapVehicleToSupabaseVehicle({
      ...vehicleData,
      images: allImages,
      attachments: allAttachments,
      thumbnail: uploadedThumbnail?.url || vehicleData.thumbnail || currentVehicle.thumbnail,
    });

    const { data, error } = await supabase
      .from('vehicles')
      .update(vehicleForDb)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating vehicle:', error);
      throw new Error(`Failed to update vehicle: ${error.message}`);
    }

    return mapSupabaseVehicleToVehicle(data);
  } catch (error) {
    console.error('Error in updateVehicle:', error);
    throw error;
  }
};

export const getAllVehicles = async (): Promise<Vehicle[]> => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error(`Failed to fetch vehicles: ${error.message}`);
    }

    return data.map(mapSupabaseVehicleToVehicle);
  } catch (error) {
    console.error('Error in getAllVehicles:', error);
    throw error;
  }
};

export const deleteVehicle = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting vehicle:', error);
      throw new Error(`Failed to delete vehicle: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteVehicle:', error);
    throw error;
  }
};
