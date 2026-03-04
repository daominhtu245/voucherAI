import { User } from "@/types/user";

export const DEMO_USER: User = {
  id: "demo-user-1",
  username: "bandemo",
  full_name: "Bạn Demo",
  avatar_url: undefined,
  bio: "Tôi thích tặng voucher cảm xúc 🎁",
  is_pro: false,
  voucher_count: 0,
  created_at: new Date().toISOString(),
};

const USER_KEY = "voucher_ai_user";

export function loginDemo(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(DEMO_USER));
  }
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
