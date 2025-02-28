import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    const apis = [process.env.NEXT_FIRST_GEMINI_API_KEY, process.env.NEXT_SECOND_GEMINI_API_KEY];
    for (let i = 0; i < 2; i++) {
        try {
            const { message } = await req.json();
            const apiKey = apis[i];
            if (!apiKey) {
                return NextResponse.json({ error: "Missing API key" }, { status: 500 });
            }

            // Create a client and select a Gemini model.
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            // Call the Gemini API with the user’s message as prompt.
            const result = await model.generateContent(message);
            const botReply = result.response.text();
            return NextResponse.json({ reply: botReply });
        } catch (error) {
            console.error("Error in POST /api/chat:", error);
            return NextResponse.json(
                { error: "Error generating response" },
                { status: 500 }
            );
        }
    }
}
