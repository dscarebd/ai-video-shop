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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          service: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          service?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          service?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          member_id: string | null
          question: string
          scope: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          member_id?: string | null
          question: string
          scope?: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          member_id?: string | null
          question?: string
          scope?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "faqs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          client: string
          created_at: string
          description: string
          id: string
          sort_order: number
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          category?: string
          client?: string
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          category?: string
          client?: string
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          author_role: string
          content: string
          created_at: string
          id: string
          member_id: string | null
          rating: number
          scope: string
          sort_order: number
        }
        Insert: {
          author_name: string
          author_role?: string
          content: string
          created_at?: string
          id?: string
          member_id?: string | null
          rating?: number
          scope?: string
          sort_order?: number
        }
        Update: {
          author_name?: string
          author_role?: string
          content?: string
          created_at?: string
          id?: string
          member_id?: string | null
          rating?: number
          scope?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string
          features: Json
          id: string
          image_url: string | null
          price_label: string
          sort_order: number
          tier: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          features?: Json
          id?: string
          image_url?: string | null
          price_label?: string
          sort_order?: number
          tier?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          features?: Json
          id?: string
          image_url?: string | null
          price_label?: string
          sort_order?: number
          tier?: string
          title?: string
        }
        Relationships: []
      }
      slug_redirects: {
        Row: {
          created_at: string
          id: string
          member_id: string | null
          new_slug: string
          old_slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id?: string | null
          new_slug: string
          old_slug: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string | null
          new_slug?: string
          old_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "slug_redirects_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          address: string
          bio: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          photo_url: string | null
          role: string
          slug: string
          sort_order: number
          starting_price: string
          updated_at: string
        }
        Insert: {
          address?: string
          bio?: string
          created_at?: string
          email?: string
          id?: string
          name: string
          phone?: string
          photo_url?: string | null
          role?: string
          slug: string
          sort_order?: number
          starting_price?: string
          updated_at?: string
        }
        Update: {
          address?: string
          bio?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          photo_url?: string | null
          role?: string
          slug?: string
          sort_order?: number
          starting_price?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_skills: {
        Row: {
          created_at: string
          id: string
          level: number
          member_id: string
          skill_name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number
          member_id: string
          skill_name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          member_id?: string
          skill_name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_skills_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      slugify: { Args: { input: string }; Returns: string }
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
