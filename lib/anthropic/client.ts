import OpenAI from "openai";

let client: OpenAI | null = null;

export function getAnthropicClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return client;
}
