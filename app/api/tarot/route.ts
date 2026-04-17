import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      question,
      card,
      isTrueReading,
      period,
    }: {
      question: string;
      card: {
        name: string;
        type: "Major Arcana" | "Minor Arcana";
        suit?: string;
        orientation: "Upright" | "Reversed";
        interpretation: string;
      };
      isTrueReading: boolean;
      period: "hour" | "day" | "week" | "month";
    } = body;

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY on the server." },
        { status: 500 }
      );
    }

    if (!question?.trim()) {
      return Response.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    if (!card?.name || !card?.orientation || !card?.interpretation) {
      return Response.json(
        { error: "Card data is required." },
        { status: 400 }
      );
    }

    const prompt = `
You are interpreting a tarot reading for reflection and personal insight.
Do not claim certainty, supernatural fact, or guaranteed outcomes.
Be thoughtful, symbolic, grounded, and concise.

User question:
${question}

Card:
- Name: ${card.name}
- Type: ${card.type}
- Suit: ${card.suit ?? "N/A"}
- Orientation: ${card.orientation}
- Base meaning: ${card.interpretation}

Reading status:
- isTrueReading: ${isTrueReading}
- period: ${period}

Return JSON with exactly these keys:
title
interpretation
advice
caution
truthNote
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            interpretation: { type: "string" },
            advice: { type: "string" },
            caution: { type: "string" },
            truthNote: { type: "string" },
          },
          required: [
            "title",
            "interpretation",
            "advice",
            "caution",
            "truthNote",
          ],
        },
        temperature: 0.9,
      },
    });

    const text = response.text;

    if (!text) {
      return Response.json(
        { error: "No response from Gemini." },
        { status: 500 }
      );
    }

    return Response.json(JSON.parse(text));
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to generate interpretation." },
      { status: 500 }
    );
  }
}