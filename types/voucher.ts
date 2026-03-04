export type Occasion =
  | "valentine"
  | "birthday"
  | "womens-day"
  | "teachers-day"
  | "tet"
  | "christmas"
  | "anniversary"
  | "everyday";

export type Tone = "funny" | "romantic" | "warm" | "playful";

export type Relationship =
  | "lover"
  | "friend"
  | "parent"
  | "sibling"
  | "colleague"
  | "child";

export type ThemeId = "retro" | "luxury" | "cute" | "minimal" | "y2k" | "nature" | "neon" | "polaroid" | "birthday";

export type VoucherStatus = "active" | "claimed" | "used" | "expired";

export interface AISuggestion {
  title: string;
  description: string;
  fine_print: string;
  suggested_theme: ThemeId;
  tone_match?: number;
}

export interface VoucherContent {
  title: string;
  description: string;
  fine_print: string;
}

export interface Voucher {
  id: string;
  creator_id: string;
  creator_name?: string;
  creator_avatar?: string;

  // Content
  title: string;
  description: string;
  fine_print?: string;

  // Metadata
  occasion: Occasion;
  tone: Tone;
  relationship: Relationship;
  recipient_name?: string;

  // Layout
  theme_id: ThemeId;
  primary_color: string;
  font_family: string;

  // Claim
  claim_token: string;
  status: VoucherStatus;
  expires_at?: string;
  claimed_at?: string;
  claimed_by?: string;
  used_at?: string;

  // Visibility
  is_public: boolean;

  // Stats
  view_count: number;
  like_count: number;
  share_count: number;

  created_at: string;
  updated_at: string;
}

export interface CreateVoucherInput {
  title: string;
  description: string;
  fine_print?: string;
  occasion: Occasion;
  tone: Tone;
  relationship: Relationship;
  recipient_name?: string;
  theme_id: ThemeId;
  primary_color: string;
  expires_at?: string;
  is_public: boolean;
}

export interface VoucherTheme {
  id: ThemeId;
  name: string;
  description: string;
  bgColor: string;
  bgGradient?: string;
  textColor: string;
  accentColor: string;
  borderStyle: string;
  fontClass: string;
  emoji: string;
}

export const OCCASIONS: Record<Occasion, { label: string; emoji: string }> = {
  valentine: { label: "Valentine", emoji: "💕" },
  birthday: { label: "Sinh nhật", emoji: "🎂" },
  "womens-day": { label: "8/3 - 20/10", emoji: "🌸" },
  "teachers-day": { label: "20/11", emoji: "📚" },
  tet: { label: "Tết", emoji: "🧧" },
  christmas: { label: "Noel", emoji: "🎄" },
  anniversary: { label: "Kỷ niệm", emoji: "💍" },
  everyday: { label: "Ngày thường", emoji: "☀️" },
};

export const TONES: Record<Tone, { label: string; emoji: string; description: string }> = {
  funny: { label: "Hài hước", emoji: "😂", description: "Vui vẻ, hài hước, không nhạt" },
  romantic: { label: "Lãng mạn", emoji: "💕", description: "Ngọt ngào, xúc động, tình cảm" },
  warm: { label: "Ấm áp", emoji: "🤗", description: "Chân thành, ấm lòng, gần gũi" },
  playful: { label: "Nghịch ngợm", emoji: "😈", description: "Ranh mãnh, tinh nghịch, sáng tạo" },
};

export const RELATIONSHIPS: Record<Relationship, { label: string; emoji: string }> = {
  lover: { label: "Người yêu", emoji: "❤️" },
  friend: { label: "Bạn thân", emoji: "🤝" },
  parent: { label: "Bố mẹ", emoji: "👨‍👩‍👧" },
  sibling: { label: "Anh chị em", emoji: "👫" },
  colleague: { label: "Đồng nghiệp", emoji: "💼" },
  child: { label: "Con cái", emoji: "🧒" },
};
