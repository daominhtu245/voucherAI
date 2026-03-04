export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          is_pro: boolean;
          voucher_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          is_pro?: boolean;
          voucher_count?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      vouchers: {
        Row: {
          id: string;
          creator_id: string | null;
          title: string;
          description: string;
          fine_print: string | null;
          occasion: string;
          tone: string;
          relationship: string;
          recipient_name: string | null;
          theme_id: string;
          primary_color: string;
          font_family: string;
          claim_token: string;
          status: string;
          expires_at: string | null;
          claimed_at: string | null;
          claimed_by: string | null;
          used_at: string | null;
          is_public: boolean;
          is_collab: boolean;
          view_count: number;
          like_count: number;
          share_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["vouchers"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vouchers"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
    };
  };
}
