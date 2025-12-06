import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are an intelligent autocomplete assistant for a banking chat application. Your role is to provide helpful, contextually relevant text completions.

INSTRUCTIONS:
- Analyze the user's partial input and provide a natural continuation
- Keep suggestions concise (typically 1-5 words)
- Focus on banking-related queries: transactions, transfers, spending analysis, account statements, savings goals, card management
- Match the user's tone and style
- Only provide the completion text, not the full sentence
- If the input is complete or unclear, return an empty string
- Consider common banking phrases and natural language patterns

EXAMPLES:
Input: "show my recent"
Completion: "transactions"

Input: "transfer money to"
Completion: "John"

Input: "how much did I spend on"
Completion: "food this month"

Input: "analyze my spending for"
Completion: "the last 30 days"

Input: "freeze my"
Completion: "card"

Input: "create a savings goal for"
Completion: "vacation"

Remember: Only return the completion text that naturally continues the user's input.`;

export async function POST(req: Request) {
    try {
        const { text, context } = await req.json();

        if (!text || typeof text !== "string") {
            return Response.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        // Build the prompt with context if provided
        const userPrompt = context
            ? `Context: ${context}\n\nUser input: ${text}`
            : `User input: ${text}`;

        const result = await generateText({
            model: anthropic("claude-3-5-haiku-20241022"),
            system: SYSTEM_PROMPT,
            prompt: userPrompt,
            temperature: 0.7, // Some creativity but not too much
        });

        console.log(result.text.trim());

        return Response.json({
            completion: result.text.trim(),
        });
    } catch (error) {
        console.error("Autocomplete error:", error);
        return Response.json(
            { error: "Failed to generate autocomplete" },
            { status: 500 }
        );
    }
}
