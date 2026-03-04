import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic/client";
import { VOUCHER_GENERATE_PROMPT, fillPrompt } from "@/lib/anthropic/prompts";
import { AISuggestion } from "@/types/voucher";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { occasion, tone, relationship, recipient_name, custom_hint, count = 5 } = body;

    if (!occasion || !tone || !relationship) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc: occasion, tone, relationship" },
        { status: 400 }
      );
    }

    const prompt = fillPrompt(VOUCHER_GENERATE_PROMPT, {
      occasion,
      tone,
      relationship,
      recipient_name: recipient_name || "người nhận",
      custom_hint: custom_hint || "không có gợi ý thêm",
      count: String(count),
    });

    const client = getAnthropicClient();
    const message = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.choices[0]?.message?.content ?? "";

    // Strip markdown backticks nếu có
    const cleaned = raw
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const suggestions: AISuggestion[] = JSON.parse(cleaned);

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("AI generate error:", err);
    return NextResponse.json(
      { error: "Không thể generate. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
