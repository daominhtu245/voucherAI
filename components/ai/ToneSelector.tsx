"use client";

import { Tone, TONES } from "@/types/voucher";

interface ToneSelectorProps {
  value: Tone | "";
  onChange: (tone: Tone) => void;
}

export default function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(Object.entries(TONES) as [Tone, typeof TONES[Tone]][]).map(([id, tone]) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95 ${
            value === id
              ? "border-primary bg-rose-50 shadow-sm"
              : "border-gray-200 bg-white hover:border-rose-200"
          }`}
        >
          <div className="text-3xl mb-2">{tone.emoji}</div>
          <div className={`font-bold text-sm ${value === id ? "text-primary" : "text-gray-800"}`}>
            {tone.label}
          </div>
          <div className="text-xs text-gray-500 mt-1">{tone.description}</div>
        </button>
      ))}
    </div>
  );
}
