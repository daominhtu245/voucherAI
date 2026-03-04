"use client";

import { AISuggestion } from "@/types/voucher";
import { THEMES } from "@/lib/voucher/themes";
import { Sparkles, RefreshCw, Check } from "lucide-react";

interface AISuggestionsProps {
  suggestions: AISuggestion[];
  loading: boolean;
  onSelect: (s: AISuggestion) => void;
  onRegenerate: () => void;
  selected?: AISuggestion | null;
}

function SkeletonCard() {
  return (
    <div className="border-2 border-gray-100 rounded-2xl p-4 space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  );
}

export default function AISuggestions({
  suggestions,
  loading,
  onSelect,
  onRegenerate,
  selected,
}: AISuggestionsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI đang tạo ý tưởng cho bạn...</span>
        </div>
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!suggestions.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold">AI gợi ý {suggestions.length} voucher</span>
        </div>
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Làm mới
        </button>
      </div>

      <div className="space-y-3">
        {suggestions.map((s, i) => {
          const theme = THEMES[s.suggested_theme] ?? THEMES.retro;
          const isSelected = selected?.title === s.title && selected?.description === s.description;

          return (
            <button
              key={i}
              onClick={() => onSelect(s)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                isSelected
                  ? "border-primary shadow-sm bg-rose-50"
                  : "border-gray-200 bg-white hover:border-rose-200 hover:bg-rose-50/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{theme.emoji}</span>
                    <h3 className="font-bold text-gray-900 text-sm truncate">{s.title}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                      style={{
                        backgroundColor: theme.accentColor + "22",
                        color: theme.accentColor,
                      }}
                    >
                      {theme.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{s.description}</p>
                  {s.fine_print && (
                    <p className="text-xs text-gray-400 mt-1 italic">{s.fine_print}</p>
                  )}
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
