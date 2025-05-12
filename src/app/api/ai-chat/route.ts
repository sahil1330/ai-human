import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
export async function POST(request: NextRequest) {
  const { input, prompt } = await request.json();
  if (!input) {
    return new Response("Missing input", { status: 400 });
  }
  if (!prompt) {
    return new Response("Missing prompt", { status: 400 });
  }
  if (input.length > 200) {
    return new Response("Input is too long", { status: 400 });
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: [
      {
        parts: [
          {
            text: input,
          },
        ],
      },
    ],
    config: {
      systemInstruction: prompt,
      maxOutputTokens: 80,
    },
  });

  if (
    !response ||
    !response.candidates ||
    !response.candidates[0]?.content ||
    !response.candidates[0]?.content?.parts ||
    !response.candidates[0]?.content?.parts[0]?.text
  ) {
    return NextResponse.json({ error: "No response from AI" }, { status: 500 });
  }

  return NextResponse.json(
    { output: response.candidates[0].content.parts[0].text },
    { status: 200 }
  );
}
