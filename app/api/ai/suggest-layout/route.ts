import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic/client";
import { LAYOUT_SUGGEST_PROMPT, fillPrompt } from "@/lib/anthropic/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, tone, occasion } = body;

    const prompt = fillPrompt(LAYOUT_SUGGEST_PROMPT, {
      title: title || "",
      description: description || "",
      tone: tone || "",
      occasion: occasion || "",
    });

    const client = getAnthropicClient();
    const message = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Layout suggest error:", err);
    return NextResponse.json({ theme_id: "retro", primary_color: "#FF6B6B" });
  }
}
