import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseEquipmentToEquipment } from "./supabaseMappers";
import { toast } from "sonner";

/**
 * Migrates all equipment records to vehicle_equipment table
 * This is a one-time migration function
 */
export const migrateEquipmentToVehicleEquipment = async () => {
  try {
    console.log("Starting equipment migration...");
    toast.loading("Kopiowanie danych z Equipment...");

    // Fetch all equipment records
    const { data: equipmentData, error: fetchError } = await supabase
      .from('equipment')
      .select('*');

    if (fetchError) {
      console.error("Error fetching equipment:", fetchError);
      toast.dismiss();
      toast.error("Błąd podczas pobierania danych Equipment");
      return { success: false, error: fetchError };
    }

    if (!equipmentData || equipmentData.length === 0) {
      console.log("No equipment records to migrate");
      toast.dismiss();
      toast.info("Brak danych do przeniesienia");
      return { success: true, migrated: 0 };
    }

    console.log(`Found ${equipmentData.length} equipment records to migrate`);

    // Transform and insert into vehicle_equipment
    const vehicleEquipmentRecords = equipmentData.map(eq => ({
      vehicleid: eq.vehicleid,
      name: eq.name,
      brand: eq.brand,
      type: eq.type,
      model: eq.model,
      serialnumber: eq.serialnumber,
      year: eq.year,
      purchaseprice: eq.purchaseprice,
      purchasedate: eq.purchasedate,
      lastservice: eq.lastservice,
      nextservice: eq.nextservice,
      serviceexpirydate: eq.serviceexpirydate,
      servicereminderdays: eq.servicereminderdays,
      notes: eq.notes,
      status: eq.status,
      images: eq.images,
      thumbnail: eq.thumbnail,
      attachments: eq.attachments,
      // New fields will be null initially
      quantity: null,
      serviceintervalhours: null,
    }));

    // Insert records into vehicle_equipment
    const { data: insertedData, error: insertError } = await supabase
      .from('vehicle_equipment')
      .insert(vehicleEquipmentRecords)
      .select();

    if (insertError) {
      console.error("Error inserting into vehicle_equipment:", insertError);
      toast.dismiss();
      toast.error("Błąd podczas zapisywania do Vehicle Equipment");
      return { success: false, error: insertError };
    }

    console.log(`Successfully migrated ${insertedData?.length || 0} records`);
    toast.dismiss();
    toast.success(`Skopiowano ${insertedData?.length || 0} rekordów do Equipment pojazdu!`);

    return { 
      success: true, 
      migrated: insertedData?.length || 0,
      records: insertedData 
    };

  } catch (error) {
    console.error("Migration error:", error);
    toast.dismiss();
    toast.error("Nieoczekiwany błąd podczas migracji");
    return { success: false, error };
  }
};
