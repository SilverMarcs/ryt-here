import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import type { UIMessage } from "ai";
import { getActiveState } from "@/lib/bank";
import { buildSystemPrompt } from "@/lib/prompts";
import { buildBankTools, BANK_TOOL_NAMES } from "@/lib/tools/bank-tools";
import { initialBankState } from "@/lib/mock-data";
import { BankState } from "@/types/bank";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    bankState,
  }: { messages: UIMessage[]; bankState?: BankState } = await req.json();

  const state: BankState = getActiveState(bankState ?? initialBankState);
  const tools = buildBankTools(state);

  const result = streamText({
    // model: openai("gpt-5-mini"),
    // model: google("gemini-2.5-flash"),
    model: anthropic("claude-sonnet-4-5"),
    system: buildSystemPrompt(state, [...BANK_TOOL_NAMES]),
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(4),
  });

  return result.toUIMessageStreamResponse();
}
