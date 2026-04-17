import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      question,
      cards,
      isTrueReading,
      period,
    }: {
      question: string;
      cards: Array<{
        name: string;
        type: "Major Arcana" | "Minor Arcana";
        suit?: string;
        orientation: "Upright" | "Reversed";
        interpretation: string;
        position: "Situation" | "Challenge" | "Advice";
      }>;
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

    if (!cards || cards.length !== 3) {
      return Response.json(
        { error: "Exactly 3 cards are required." },
        { status: 400 }
      );
    }

    const cardsText = cards
      .map(
        (card) => `
- Position: ${card.position}
- Name: ${card.name}
- Type: ${card.type}
- Suit: ${card.suit ?? "N/A"}
- Orientation: ${card.orientation}
- Base meaning: ${card.interpretation}
`
      )
      .join("\n");

    const prompt = `
You are interpreting a tarot reading for reflection and personal insight.
Do not claim certainty, supernatural fact, or guaranteed outcomes.
Be thoughtful, symbolic, grounded, and concise.

The spread is:
1. Situation
2. Challenge
3. Advice

User question:
${question}

Cards:
${cardsText}

Reading status:
- isTrueReading: ${isTrueReading}
- period: ${period}

Return JSON with exactly these keys:
title
interpretation
advice
caution
truthNote

Rules:
- Weave all three cards together into one coherent interpretation.
- Explain the spread in relation to the user's question.
- If isTrueReading is true, truthNote should say this is the first spread for the selected period.
- If isTrueReading is false, truthNote should clearly say this is reflective only and should not replace the original spread.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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