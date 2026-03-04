export const VOUCHER_GENERATE_PROMPT = `Bạn là chuyên gia tạo voucher cảm xúc hài hước và ý nghĩa.
Tạo {count} gợi ý voucher dựa trên thông tin sau:

- Dịp: {occasion}
- Tone: {tone}
- Mối quan hệ: {relationship}
- Tên người nhận: {recipient_name}
- Gợi ý cá nhân: {custom_hint}

Mỗi voucher gồm:
1. title: Tên ngắn (VD: "Voucher Tha Thứ", "Voucher 1 Đêm Tự Do")
2. description: Nội dung chính (1-2 câu, tone phù hợp, cụ thể và buồn cười/xúc động)
3. fine_print: Điều kiện hài hước ở dưới cùng (bắt đầu bằng "*", 1 câu ngắn)
4. suggested_theme: 1 trong [retro, luxury, cute, minimal, y2k, nature]

Yêu cầu:
- Tiếng Việt, tự nhiên, không cứng nhắc
- Cụ thể và cá nhân hóa với gợi ý đã cho
- Tone hài phải thực sự buồn cười, không nhạt
- Tone lãng mạn phải thực sự xúc động
- Tránh nội dung chung chung như "1 buổi cà phê"

Trả về JSON array, KHÔNG có markdown backticks. Ví dụ:
[{"title":"...","description":"...","fine_print":"...","suggested_theme":"retro"}]`;

export const LAYOUT_SUGGEST_PROMPT = `Dựa vào nội dung voucher sau, gợi ý theme phù hợp nhất:
- Title: {title}
- Description: {description}
- Tone: {tone}
- Occasion: {occasion}

Trả về JSON thuần (không markdown): {"theme_id":"retro|luxury|cute|minimal|y2k|nature","primary_color":"#hex","reason":"..."}`;

export function fillPrompt(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}
