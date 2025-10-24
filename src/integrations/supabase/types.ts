export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      devices: {
        Row: {
          attachments: Json | null
          brand: string | null
          id: string
          images: Json | null
          lastservice: string | null
          model: string | null
          name: string
          nextservice: string | null
          notes: string | null
          purchasedate: string | null
          purchaseprice: number | null
          serialnumber: string | null
          serviceexpirydate: string | null
          serviceintervalhours: number | null
          servicereminderdays: number | null
          status: string | null
          thumbnail: string | null
          type: string | null
          vehicleid: string | null
          year: number | null
        }
        Insert: {
          attachments?: Json | null
          brand?: string | null
          id?: string
          images?: Json | null
          lastservice?: string | null
          model?: string | null
          name: string
          nextservice?: string | null
          notes?: string | null
          purchasedate?: string | null
          purchaseprice?: number | null
          serialnumber?: string | null
          serviceexpirydate?: string | null
          serviceintervalhours?: number | null
          servicereminderdays?: number | null
          status?: string | null
          thumbnail?: string | null
          type?: string | null
          vehicleid?: string | null
          year?: number | null
        }
        Update: {
          attachments?: Json | null
          brand?: string | null
          id?: string
          images?: Json | null
          lastservice?: string | null
          model?: string | null
          name?: string
          nextservice?: string | null
          notes?: string | null
          purchasedate?: string | null
          purchaseprice?: number | null
          serialnumber?: string | null
          serviceexpirydate?: string | null
          serviceintervalhours?: number | null
          servicereminderdays?: number | null
          status?: string | null
          thumbnail?: string | null
          type?: string | null
          vehicleid?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_vehicleid_fkey"
            columns: ["vehicleid"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          attachments: Json | null
          brand: string | null
          id: string
          images: Json | null
          lastservice: string | null
          model: string | null
          name: string
          nextservice: string | null
          notes: string | null
          purchasedate: string | null
          purchaseprice: number | null
          serialnumber: string | null
          serviceexpirydate: string | null
          servicereminderdays: number | null
          status: string | null
          thumbnail: string | null
          type: string | null
          vehicleid: string | null
          year: number | null
        }
        Insert: {
          attachments?: Json | null
          brand?: string | null
          id?: string
          images?: Json | null
          lastservice?: string | null
          model?: string | null
          name: string
          nextservice?: string | null
          notes?: string | null
          purchasedate?: string | null
          purchaseprice?: number | null
          serialnumber?: string | null
          serviceexpirydate?: string | null
          servicereminderdays?: number | null
          status?: string | null
          thumbnail?: string | null
          type?: string | null
          vehicleid?: string | null
          year?: number | null
        }
        Update: {
          attachments?: Json | null
          brand?: string | null
          id?: string
          images?: Json | null
          lastservice?: string | null
          model?: string | null
          name?: string
          nextservice?: string | null
          notes?: string | null
          purchasedate?: string | null
          purchaseprice?: number | null
          serialnumber?: string | null
          serviceexpirydate?: string | null
          servicereminderdays?: number | null
          status?: string | null
          thumbnail?: string | null
          type?: string | null
          vehicleid?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_vehicleid_fkey"
            columns: ["vehicleid"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_records: {
        Row: {
          attachments: Json | null
          cost: number | null
          date: string
          description: string | null
          deviceid: string | null
          devicename: string | null
          id: string
          images: Json | null
          location: string | null
          notes: string | null
          technician: string | null
          type: string | null
          vehicleid: string | null
        }
        Insert: {
          attachments?: Json | null
          cost?: number | null
          date: string
          description?: string | null
          deviceid?: string | null
          devicename?: string | null
          id?: string
          images?: Json | null
          location?: string | null
          notes?: string | null
          technician?: string | null
          type?: string | null
          vehicleid?: string | null
        }
        Update: {
          attachments?: Json | null
          cost?: number | null
          date?: string
          description?: string | null
          deviceid?: string | null
          devicename?: string | null
          id?: string
          images?: Json | null
          location?: string | null
          notes?: string | null
          technician?: string | null
          type?: string | null
          vehicleid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_records_deviceid_fkey"
            columns: ["deviceid"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_records_vehicleid_fkey"
            columns: ["vehicleid"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_equipment: {
        Row: {
          attachments: Json | null
          brand: string | null
          id: string
          images: Json | null
          lastservice: string | null
          model: string | null
          name: string
          nextservice: string | null
          notes: string | null
          purchasedate: string | null
          purchaseprice: number | null
          serialnumber: string | null
          serviceexpirydate: string | null
          servicereminderdays: number | null
          status: string | null
          thumbnail: string | null
          type: string | null
          vehicleid: string | null
          year: number | null
        }
        Insert: {
          attachments?: Json | null
          brand?: string | null
          id?: string
          images?: Json | null
          lastservice?: string | null
          model?: string | null
          name: string
          nextservice?: string | null
          notes?: string | null
          purchasedate?: string | null
          purchaseprice?: number | null
          serialnumber?: string | null
          serviceexpirydate?: string | null
          servicereminderdays?: number | null
          status?: string | null
          thumbnail?: string | null
          type?: string | null
          vehicleid?: string | null
          year?: number | null
        }
        Update: {
          attachments?: Json | null
          brand?: string | null
          id?: string
          images?: Json | null
          lastservice?: string | null
          model?: string | null
          name?: string
          nextservice?: string | null
          notes?: string | null
          purchasedate?: string | null
          purchaseprice?: number | null
          serialnumber?: string | null
          serviceexpirydate?: string | null
          servicereminderdays?: number | null
          status?: string | null
          thumbnail?: string | null
          type?: string | null
          vehicleid?: string | null
          year?: number | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          attachments: Json | null
          brand: string | null
          drivername: string | null
          fuelcardnumber: string | null
          gpssystemnumber: string | null
          id: string
          images: Json | null
          inspectionexpirydate: string | null
          inspectionreminderdays: number | null
          insuranceexpirydate: string | null
          insurancepolicynumber: string | null
          insurancereminderdays: number | null
          lastservice: string | null
          mdvrnumber: string | null
          model: string | null
          name: string
          nextservice: string | null
          notes: string | null
          purchasedate: string | null
          registrationnumber: string | null
          serviceexpirydate: string | null
          servicereminderdays: number | null
          status: string | null
          tags: string | null
          thumbnail: string | null
          vehicletype: string | null
          vin: string | null
          year: number | null
        }
        Insert: {
          attachments?: Json | null
          brand?: string | null
          drivername?: string | null
          fuelcardnumber?: string | null
          gpssystemnumber?: string | null
          id?: string
          images?: Json | null
          inspectionexpirydate?: string | null
          inspectionreminderdays?: number | null
          insuranceexpirydate?: string | null
          insurancepolicynumber?: string | null
          insurancereminderdays?: number | null
          lastservice?: string | null
          mdvrnumber?: string | null
          model?: string | null
          name: string
          nextservice?: string | null
          notes?: string | null
          purchasedate?: string | null
          registrationnumber?: string | null
          serviceexpirydate?: string | null
          servicereminderdays?: number | null
          status?: string | null
          tags?: string | null
          thumbnail?: string | null
          vehicletype?: string | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          attachments?: Json | null
          brand?: string | null
          drivername?: string | null
          fuelcardnumber?: string | null
          gpssystemnumber?: string | null
          id?: string
          images?: Json | null
          inspectionexpirydate?: string | null
          inspectionreminderdays?: number | null
          insuranceexpirydate?: string | null
          insurancepolicynumber?: string | null
          insurancereminderdays?: number | null
          lastservice?: string | null
          mdvrnumber?: string | null
          model?: string | null
          name?: string
          nextservice?: string | null
          notes?: string | null
          purchasedate?: string | null
          registrationnumber?: string | null
          serviceexpirydate?: string | null
          servicereminderdays?: number | null
          status?: string | null
          tags?: string | null
          thumbnail?: string | null
          vehicletype?: string | null
          vin?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
