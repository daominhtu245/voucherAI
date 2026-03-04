export interface User {
  id: string;
  username?: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  is_pro: boolean;
  voucher_count: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "claimed" | "liked" | "used" | "reminder";
  title: string;
  body?: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}
