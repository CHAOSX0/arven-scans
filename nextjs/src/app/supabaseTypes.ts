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
      admins: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admins_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      analytics: {
        Row: {
          created_at: string | null
          id: number
          number: number
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          number: number
          type?: string
        }
        Update: {
          created_at?: string | null
          id?: number
          number?: number
          type?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          created_at: string
          id: number
          number: number
          pages: string[]
          seriesSlug: string
          title: string | null
          view: number
          views: number
        }
        Insert: {
          created_at?: string
          id?: number
          number: number
          pages: string[]
          seriesSlug: string
          title?: string | null
          view?: number
          views?: number
        }
        Update: {
          created_at?: string
          id?: number
          number?: number
          pages?: string[]
          seriesSlug?: string
          title?: string | null
          view?: number
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "chapters_seriesSlug_fkey"
            columns: ["seriesSlug"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["slug"]
          }
        ]
      }
      comments: {
        Row: {
          author: string
          authorAvatar: string | null
          authorUsername: string
          chapterID: number | null
          created_at: string
          id: number
          seriesSlug: string | null
          text: string
          time: string
          votes: number | null
        }
        Insert: {
          author: string
          authorAvatar?: string | null
          authorUsername: string
          chapterID?: number | null
          created_at?: string
          id?: number
          seriesSlug?: string | null
          text: string
          time: string
          votes?: number | null
        }
        Update: {
          author?: string
          authorAvatar?: string | null
          authorUsername?: string
          chapterID?: number | null
          created_at?: string
          id?: number
          seriesSlug?: string | null
          text?: string
          time?: string
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_chapterID_fkey"
            columns: ["chapterID"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_seriesSlug_fkey"
            columns: ["seriesSlug"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["slug"]
          }
        ]
      }
      genres: {
        Row: {
          created_at: string
          id: number
          slug: string
          text: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          slug: string
          text?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          slug?: string
          text?: string | null
        }
        Relationships: []
      }
      series: {
        Row: {
          alternativeTitles: string | null
          artist: string | null
          author: string | null
          BannerURL: string | null
          coverURL: string
          created_at: string
          description: string
          genres: string[] | null
          id: number
          is_visible: boolean | null
          isSlider: boolean | null
          ratting: number | null
          releaseYear: number
          slug: string
          status: string
          title: string
          type: string | null
          updated_at: string | null
          URL: string
          viewCount: number | null
          views: number
        }
        Insert: {
          alternativeTitles?: string | null
          artist?: string | null
          author?: string | null
          BannerURL?: string | null
          coverURL: string
          created_at?: string
          description: string
          genres?: string[] | null
          id?: number
          is_visible?: boolean | null
          isSlider?: boolean | null
          ratting?: number | null
          releaseYear: number
          slug: string
          status: string
          title: string
          type?: string | null
          updated_at?: string | null
          URL?: string
          viewCount?: number | null
          views?: number
        }
        Update: {
          alternativeTitles?: string | null
          artist?: string | null
          author?: string | null
          BannerURL?: string | null
          coverURL?: string
          created_at?: string
          description?: string
          genres?: string[] | null
          id?: number
          is_visible?: boolean | null
          isSlider?: boolean | null
          ratting?: number | null
          releaseYear?: number
          slug?: string
          status?: string
          title?: string
          type?: string | null
          updated_at?: string | null
          URL?: string
          viewCount?: number | null
          views?: number
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: number
          name: string
          type: string
          value: string
        }
        Insert: {
          id?: number
          name: string
          type?: string
          value: string
        }
        Update: {
          id?: number
          name?: string
          type?: string
          value?: string
        }
        Relationships: []
      }
      statuses: {
        Row: {
          created_at: string
          id: number
          slug: string | null
          text: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          slug?: string | null
          text?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          slug?: string | null
          text?: string | null
        }
        Relationships: []
      }
      types: {
        Row: {
          created_at: string
          id: number
          slug: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: number
          slug: string
          text: string
        }
        Update: {
          created_at?: string
          id?: number
          slug?: string
          text?: string
        }
        Relationships: []
      }
      uploaders: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploaders_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploaders_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      users: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_confirmed_at: string | null
          id: string | null
          is_sso_user: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          raw_user_meta_data: Json | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_confirmed_at?: string | null
          id?: string | null
          is_sso_user?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          raw_user_meta_data?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_confirmed_at?: string | null
          id?: string | null
          is_sso_user?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          raw_user_meta_data?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      increment: {
        Args: {
          table_name: string
          row_id: number
          x: number
          field_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
