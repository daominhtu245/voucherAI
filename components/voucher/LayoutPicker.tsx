"use client";

import { ThemeId } from "@/types/voucher";
import { THEMES } from "@/lib/voucher/themes";
import { Sparkles } from "lucide-react";

interface LayoutPickerProps {
  value: ThemeId;
  onChange: (id: ThemeId) => void;
  suggestedTheme?: ThemeId;
}

export default function LayoutPicker({ value, onChange, suggestedTheme }: LayoutPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {(Object.values(THEMES) as typeof THEMES[ThemeId][]).map((theme) => (
        <button
          key={theme.id}
          onClick={() => onChange(theme.id)}
          className={`relative p-3 rounded-2xl border-2 transition-all active:scale-95 text-left ${
            value === theme.id
              ? "border-primary shadow-md ring-2 ring-rose-200"
              : "border-gray-200 hover:border-rose-200"
          }`}
          style={{
            background: theme.bgGradient || theme.bgColor,
            color: theme.textColor,
          }}
        >
          {/* AI suggested */}
          {suggestedTheme === theme.id && (
            <div className="absolute -top-2 -right-2 bg-accent text-gray-800 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow z-10">
              <Sparkles className="w-3 h-3" />AI
            </div>
          )}
          {/* Selected dot */}
          {value === theme.id && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full shadow" />
          )}

          {/* Mini preview */}
          <div className="text-xl mb-1">{theme.emoji}</div>
          <div className="text-xs font-black mb-0.5 truncate" style={{ color: theme.accentColor }}>
            {theme.name}
          </div>
          <div className="text-xs opacity-50 leading-tight line-clamp-2">{theme.description}</div>
        </button>
      ))}
    </div>
  );
}
