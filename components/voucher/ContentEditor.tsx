"use client";

import { VoucherContent } from "@/types/voucher";

interface ContentEditorProps {
  value: VoucherContent;
  onChange: (v: VoucherContent) => void;
}

export default function ContentEditor({ value, onChange }: ContentEditorProps) {
  const update = (field: keyof VoucherContent, val: string) =>
    onChange({ ...value, [field]: val });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tên voucher <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          value={value.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder='VD: "Voucher Tha Thứ", "Voucher 1 Đêm Tự Do"'
          maxLength={60}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-primary transition-colors placeholder:font-normal placeholder:text-gray-400"
        />
        <div className="text-right text-xs text-gray-400 mt-1">{value.title.length}/60</div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nội dung voucher <span className="text-primary">*</span>
        </label>
        <textarea
          value={value.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder='VD: "1 lần được ngủ quên mà không bị nhắn tin 50 cái"'
          maxLength={200}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-gray-400"
        />
        <div className="text-right text-xs text-gray-400 mt-1">{value.description.length}/200</div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Điều kiện nhỏ{" "}
          <span className="text-gray-400 font-normal">(hài hước, tùy chọn)</span>
        </label>
        <input
          type="text"
          value={value.fine_print}
          onChange={(e) => update("fine_print", e.target.value)}
          placeholder='VD: "* Áp dụng trước 10pm, sau đó người tặng không chịu trách nhiệm"'
          maxLength={120}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}
