"use client";

import { Voucher, ThemeId } from "@/types/voucher";
import { getTheme } from "@/lib/voucher/themes";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Ticket } from "lucide-react";

interface VoucherCardProps {
  voucher: Partial<Voucher> & {
    title: string;
    description: string;
    theme_id: ThemeId;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Per-theme decorative elements
function ThemeDecorations({ themeId, accentColor }: { themeId: ThemeId; accentColor: string }) {
  if (themeId === "retro") return (
    <>
      {/* Dashed tear edges */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-100 border-2 border-dashed border-amber-400" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-amber-100 border-2 border-dashed border-amber-400" />
      {/* Diagonal stripes */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${accentColor} 0px, ${accentColor} 2px, transparent 2px, transparent 14px)` }} />
    </>
  );

  if (themeId === "luxury") return (
    <>
      {/* Gold shimmer lines */}
      <div className="absolute top-3 left-4 right-4 h-px opacity-30" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
      <div className="absolute bottom-3 left-4 right-4 h-px opacity-30" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
      {/* Corner ornaments */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 opacity-40" style={{ borderColor: accentColor }} />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 opacity-40" style={{ borderColor: accentColor }} />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 opacity-40" style={{ borderColor: accentColor }} />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 opacity-40" style={{ borderColor: accentColor }} />
    </>
  );

  if (themeId === "cute") return (
    <>
      {/* Floating hearts */}
      {["top-2 right-6", "top-6 right-2", "bottom-8 left-3"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} text-lg opacity-30 animate-float`} style={{ animationDelay: `${i * 0.8}s` }}>💕</div>
      ))}
      {/* Stars */}
      {["top-3 left-4", "bottom-3 right-6"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} text-sm opacity-20`}>⭐</div>
      ))}
    </>
  );

  if (themeId === "neon") return (
    <>
      {/* Neon glow overlay */}
      <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 30% 50%, ${accentColor} 0%, transparent 60%), radial-gradient(circle at 70% 50%, #FF00FF 0%, transparent 60%)` }} />
      {/* Scan lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)` }} />
      {/* Corner dots */}
      {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full`} style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
      ))}
    </>
  );

  if (themeId === "polaroid") return (
    <>
      {/* Film perforations top */}
      <div className="absolute top-0 left-0 right-0 h-2 flex gap-2 px-2 items-center overflow-hidden opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
        ))}
      </div>
      {/* Vintage grain overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
    </>
  );

  if (themeId === "birthday") return (
    <>
      {/* Confetti dots */}
      {[
        { pos: "top-3 left-8", color: "#FF6B6B", shape: "rounded-full", size: "w-2 h-2" },
        { pos: "top-5 right-10", color: "#FFD93D", shape: "rounded-sm rotate-45", size: "w-2 h-2" },
        { pos: "top-8 left-16", color: "#6BCB77", shape: "rounded-full", size: "w-1.5 h-1.5" },
        { pos: "bottom-6 left-10", color: "#4D96FF", shape: "rounded-sm", size: "w-2 h-1" },
        { pos: "bottom-4 right-8", color: "#FF922B", shape: "rounded-full", size: "w-2 h-2" },
        { pos: "top-4 left-32", color: "#E64980", shape: "rounded-full", size: "w-1.5 h-1.5" },
      ].map((d, i) => (
        <div key={i} className={`absolute ${d.pos} ${d.size} ${d.shape} opacity-50 animate-bounce-slow`} style={{ backgroundColor: d.color, animationDelay: `${i * 0.3}s` }} />
      ))}
      {/* Party emoji */}
      <div className="absolute top-2 right-2 text-lg opacity-40">🎉</div>
    </>
  );

  if (themeId === "y2k") return (
    <>
      {/* Holographic shimmer */}
      <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 50%, #fff 0%, transparent 50%)` }} />
      {/* Star deco */}
      {["top-1 left-4", "bottom-2 right-3", "top-3 right-8"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} text-sm opacity-40 animate-spin`} style={{ animationDuration: `${3 + i}s` }}>⭐</div>
      ))}
    </>
  );

  if (themeId === "nature") return (
    <>
      {/* Leaf decorations */}
      {["top-2 right-3", "bottom-3 left-2"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} text-xl opacity-20 animate-float`} style={{ animationDelay: `${i * 1.2}s` }}>🌿</div>
      ))}
    </>
  );

  return null;
}

export default function VoucherCard({ voucher, size = "md", className = "" }: VoucherCardProps) {
  const theme = getTheme(voucher.theme_id);

  const sizeClasses = {
    sm: "p-4 min-h-[160px] text-xs",
    md: "p-6 min-h-[220px] text-sm",
    lg: "p-8 min-h-[280px] text-base",
  };

  const isNeon = voucher.theme_id === "neon";

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${theme.borderStyle} ${sizeClasses[size]} ${className}`}
      style={{
        background: theme.bgGradient || theme.bgColor,
        color: theme.textColor,
        fontFamily: theme.id === "minimal" ? "Inter, sans-serif" : "Nunito, sans-serif",
        ...(isNeon ? { boxShadow: `0 0 20px ${theme.accentColor}33, 0 0 40px ${theme.accentColor}11` } : {}),
      }}
    >
      {/* Per-theme decorations */}
      <ThemeDecorations themeId={voucher.theme_id} accentColor={theme.accentColor} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="text-xs font-bold tracking-widest uppercase opacity-70 flex items-center gap-1"
            style={{ color: theme.accentColor }}
          >
            {theme.emoji} VOUCHER
          </div>
          {voucher.recipient_name && (
            <div className="text-xs opacity-60 text-right">
              Dành cho<br />
              <strong>{voucher.recipient_name}</strong>
            </div>
          )}
        </div>

        {/* Title */}
        <h2
          className={`font-black leading-tight mb-3 ${size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl"}`}
          style={{
            color: theme.accentColor,
            ...(isNeon ? { textShadow: `0 0 10px ${theme.accentColor}, 0 0 20px ${theme.accentColor}66` } : {}),
          }}
        >
          {voucher.title}
        </h2>

        {/* Divider */}
        <div
          className="w-full h-px opacity-20 mb-3 shrink-0"
          style={{
            background: `repeating-linear-gradient(90deg, ${theme.accentColor} 0px, ${theme.accentColor} 6px, transparent 6px, transparent 12px)`,
          }}
        />

        {/* Description */}
        <p className="leading-relaxed opacity-90 flex-1">{voucher.description}</p>

        {/* Fine print */}
        {voucher.fine_print && (
          <p className="mt-3 text-xs opacity-50 italic">{voucher.fine_print}</p>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-end justify-between shrink-0">
          {voucher.expires_at && (
            <div className="text-xs opacity-50">
              HSD: {format(new Date(voucher.expires_at), "dd/MM/yyyy", { locale: vi })}
            </div>
          )}
          <div className="ml-auto flex items-center gap-1 opacity-30">
            <Ticket className="w-3 h-3" />
            <span className="text-xs font-medium">VoucherAI.app</span>
          </div>
        </div>
      </div>
    </div>
  );
}
