import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export class FileStorageService {
  private static readonly BUCKET_NAME = 'vehicle-files';
  private static readonly BASE_FOLDER = 'Auta';

  // Upload files for a vehicle and organize them in folders
  static async uploadVehicleFiles(
    vehicleId: string,
    vehicleName: string,
    files: File[],
    type: 'images' | 'attachments' | 'thumbnail'
  ): Promise<string[]> {
    const uploadedUrls: string[] = [];
    
    // Create folder structure: Auta/{vehicleName}/{type}/
    const folderPath = `${this.BASE_FOLDER}/${this.sanitizeFolderName(vehicleName)}/${type}`;
    
    for (const file of files) {
      try {
        // Generate unique filename to avoid conflicts
        const fileExtension = file.name.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `${folderPath}/${uniqueFileName}`;
        
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from(this.BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Error uploading file:', error);
          throw error;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error(`Failed to upload file ${file.name}:`, error);
      }
    }
    
    return uploadedUrls;
  }
  
  // Upload single thumbnail
  static async uploadVehicleThumbnail(
    vehicleId: string,
    vehicleName: string,
    file: File
  ): Promise<string | null> {
    const urls = await this.uploadVehicleFiles(vehicleId, vehicleName, [file], 'thumbnail');
    return urls[0] || null;
  }
  
  // Delete all files for a vehicle
  static async deleteVehicleFiles(vehicleName: string): Promise<void> {
    const folderPath = `${this.BASE_FOLDER}/${this.sanitizeFolderName(vehicleName)}`;
    
    try {
      // List all files in the vehicle folder
      const { data: files, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(folderPath, {
          limit: 1000,
          offset: 0
        });
      
      if (error) {
        console.error('Error listing files for deletion:', error);
        return;
      }
      
      if (files && files.length > 0) {
        // Delete all files in the folder
        const filePaths = files.map(file => `${folderPath}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from(this.BUCKET_NAME)
          .remove(filePaths);
        
        if (deleteError) {
          console.error('Error deleting files:', deleteError);
        }
      }
    } catch (error) {
      console.error('Failed to delete vehicle files:', error);
    }
  }
  
  // Get all files for a vehicle
  static async getVehicleFiles(vehicleName: string): Promise<{
    images: string[];
    attachments: string[];
    thumbnail: string | null;
  }> {
    const result = {
      images: [] as string[],
      attachments: [] as string[],
      thumbnail: null as string | null
    };
    
    const folderPath = `${this.BASE_FOLDER}/${this.sanitizeFolderName(vehicleName)}`;
    
    try {
      // Get images
      const { data: imageFiles } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`${folderPath}/images`);
      
      if (imageFiles) {
        result.images = imageFiles.map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from(this.BUCKET_NAME)
            .getPublicUrl(`${folderPath}/images/${file.name}`);
          return publicUrl;
        });
      }
      
      // Get attachments
      const { data: attachmentFiles } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`${folderPath}/attachments`);
      
      if (attachmentFiles) {
        result.attachments = attachmentFiles.map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from(this.BUCKET_NAME)
            .getPublicUrl(`${folderPath}/attachments/${file.name}`);
          return publicUrl;
        });
      }
      
      // Get thumbnail
      const { data: thumbnailFiles } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`${folderPath}/thumbnail`);
      
      if (thumbnailFiles && thumbnailFiles.length > 0) {
        const { data: { publicUrl } } = supabase.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(`${folderPath}/thumbnail/${thumbnailFiles[0].name}`);
        result.thumbnail = publicUrl;
      }
    } catch (error) {
      console.error('Failed to get vehicle files:', error);
    }
    
    return result;
  }
  
  // Sanitize folder name to be filesystem safe
  private static sanitizeFolderName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .trim();
  }
  
  // Check if bucket exists and create if needed
  static async ensureBucketExists(): Promise<void> {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === this.BUCKET_NAME);
      
      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(this.BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ['image/*', 'application/pdf', 'text/*']
        });
        
        if (error) {
          console.error('Error creating bucket:', error);
        }
      }
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
    }
  }
}