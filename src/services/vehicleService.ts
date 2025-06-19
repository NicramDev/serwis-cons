
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/utils/types';
import { mapSupabaseVehicleToVehicle, mapVehicleToSupabaseVehicle } from '@/utils/supabaseMappers';
import { uploadMultipleFiles, uploadFileToStorage, deleteFileFromStorage } from '@/utils/fileUpload';
import { v4 as uuidv4 } from 'uuid';

export const createVehicle = async (vehicleData: Partial<Vehicle>, images: File[] = [], attachments: File[] = [], thumbnailFile?: File): Promise<Vehicle> => {
  try {
    console.log('Creating vehicle with files:', { images: images.length, attachments: attachments.length, thumbnailFile: !!thumbnailFile });
    
    // Generate unique ID for the vehicle
    const vehicleId = uuidv4();
    
    // Upload files to storage
    const uploadedImages = images.length > 0 ? await uploadMultipleFiles(images, 'vehicles/images') : [];
    const uploadedAttachments = attachments.length > 0 ? await uploadMultipleFiles(attachments, 'vehicles/attachments') : [];
    const uploadedThumbnail = thumbnailFile ? await uploadFileToStorage(thumbnailFile, 'vehicles/thumbnails') : null;

    console.log('Files uploaded:', { uploadedImages, uploadedAttachments, uploadedThumbnail });

    // Prepare vehicle data with proper structure
    const completeVehicleData: Vehicle = {
      id: vehicleId,
      name: vehicleData.name || '',
      brand: vehicleData.brand || '',
      model: vehicleData.model || '',
      year: vehicleData.year || new Date().getFullYear(),
      vin: vehicleData.vin || '',
      registrationNumber: vehicleData.registrationNumber || '',
      purchaseDate: vehicleData.purchaseDate,
      inspectionExpiryDate: vehicleData.inspectionExpiryDate,
      serviceExpiryDate: vehicleData.serviceExpiryDate,
      insuranceExpiryDate: vehicleData.insuranceExpiryDate,
      lastService: vehicleData.lastService || new Date(),
      nextService: vehicleData.nextService || new Date(new Date().setMonth(new Date().getMonth() + 6)),
      fuelCardNumber: vehicleData.fuelCardNumber,
      gpsSystemNumber: vehicleData.gpsSystemNumber,
      driverName: vehicleData.driverName,
      insuranceReminderDays: vehicleData.insuranceReminderDays || 30,
      inspectionReminderDays: vehicleData.inspectionReminderDays || 30,
      serviceReminderDays: vehicleData.serviceReminderDays || 30,
      tags: vehicleData.tags,
      notes: vehicleData.notes,
      status: vehicleData.status || 'ok',
      images: uploadedImages.map(img => img.url),
      vehicleType: vehicleData.vehicleType,
      thumbnail: uploadedThumbnail?.url || null,
      attachments: uploadedAttachments.map((att, index) => ({
        name: attachments[index]?.name || '',
        type: attachments[index]?.type || '',
        size: attachments[index]?.size || 0,
        url: att.url
      })),
    };

    // Map to database format
    const vehicleForDb = mapVehicleToSupabaseVehicle(completeVehicleData);

    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicleForDb])
      .select()
      .single();

    if (error) {
      console.error('Error creating vehicle:', error);
      throw new Error(`Failed to create vehicle: ${error.message}`);
    }

    console.log('Vehicle created successfully:', data);
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
    console.log('Updating vehicle with new files:', { newImages: newImages.length, newAttachments: newAttachments.length, thumbnailFile: !!thumbnailFile });
    
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

    console.log('New files uploaded:', { uploadedImages, uploadedAttachments, uploadedThumbnail });

    // Combine existing and new files
    const existingImages: string[] = Array.isArray(currentVehicle.images) 
      ? (currentVehicle.images as string[])
      : [];
        
    const existingAttachments = Array.isArray(currentVehicle.attachments) 
      ? (currentVehicle.attachments as Array<{name: string; type: string; size: number; url: string}>)
      : [];
    
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

    const vehicleForDb = mapVehicleToSupabaseVehicle({
      ...vehicleData,
      images: allImages,
      attachments: allAttachments,
      thumbnail: uploadedThumbnail?.url || currentVehicle.thumbnail,
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

    console.log('Vehicle updated successfully:', data);
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
