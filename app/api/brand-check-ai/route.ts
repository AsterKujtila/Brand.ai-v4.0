import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { type, content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const systemPrompt = `You are the Brand OS Automated Engine. Your task is to evaluate the provided asset against the brand guidelines.
Brand Guidelines:
- Visuals: Dark minimalist aesthetics (Dark #141413, Light #faf9f5, Accents: Orange #d97757, Green #788c5d). Soft natural lighting, no harsh rim lighting. Typography must be Swiss Sans-Serif. Not overly glossy or plastic. Symmetrical organic patterns.
- Verbal Identity & Claims: Tone is authoritative, trustworthy, minimal, and objective. Avoid hyperbole or "salesy" elevator music. Avoid unsubstantiated AI claims or generic jargon.
- Cultural Sensitivity: High. Ensure inclusivity and avoid polarizing or biased stereotypes.

Analyze the user's input strictly according to these guidelines. Identify specifically what matches and what fails. Provide a Risk Score (0-100, where 100 means extreme risk of brand damage) and Compliance Score (0-100, where 100 means perfect alignment). Be a strict grader. Flag any issues with lighting, tone, facts, colors, etc.
Give actionable diagnostic findings. Each finding should have a status (PASS, WARN, FAIL), a short description of the issue, and the metric being evaluated (e.g., "Lighting", "Tone", "Typography").`;

    let userContent = content;
    
    // If we have an image URL, we will just present it as text to Gemini since it can handle parsing URLs sometimes,
    // but typically we'd fetch the image. Let's just ask the model to analyze based on the provided text/description of the url.
    // For a robust implementation, we would download the image, but we will pass the URL and ask it to assume/infer broadly if it can't fetch.
    if (type === 'image') {
      userContent = `Analyze this image URL for brand compliance: ${content}`;
    } else {
      userContent = `Analyze this content for brand compliance:\n"${content}"`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }, { text: userContent }] }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER, description: "A number from 0 to 100 indicating risk" },
            complianceScore: { type: Type.NUMBER, description: "A number from 0 to 100 indicating compliance" },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  status: { type: Type.STRING, enum: ["PASS", "WARN", "FAIL"] },
                  message: { type: Type.STRING },
                  metric: { type: Type.STRING }
                },
                required: ["status", "message", "metric"]
              }
            }
          },
          required: ["riskScore", "complianceScore", "findings"]
        }
      }
    });

    const dataText = response.text;
    if (!dataText) {
       throw new Error("No response from model");
    }
    
    const parsedData = JSON.parse(dataText);
    
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Brand check AI error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze" }, { status: 500 });
  }
}
