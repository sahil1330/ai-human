/* eslint-disable @typescript-eslint/no-explicit-any */
import { SpeechClient } from "@google-cloud/speech"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        return new Response("Missing Google service account key", { status: 500 });
    }
    const serviceAccountKey = JSON.parse(
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string
    );
    const client = new SpeechClient({
        credentials: serviceAccountKey
    });

    try {
        const formData = await request.formData();
        const audioFile = formData.get("audio");
        if (!audioFile || !(audioFile instanceof Blob)) {
            return NextResponse.json(
                { error: "Missing or invalid audio file" },
                { status: 400 }
            );
        }

        // Convert Blob to Buffer
        const bytes = await audioFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Configure the request for speech recognition
        const speechRequest = {
            audio: {
                content: buffer.toString("base64"), // Convert buffer to base64 string  
            },
            config: {
                encoding: "WEBM_OPUS" as const,
                sampleRateHertz: 48000,
                languageCode: "en-US",
                enableAutomaticPunctuation: true,
                model: "latest_short",
                useEnhanced: true
            }
        }

        const [response] = await client.recognize(speechRequest);
        if (!response.results || response.results.length === 0) {
            return NextResponse.json(
                { error: "No speech recognized" },
                { status: 400 }
            );
        }

        const transcription = response.results.map((result: any) => result.alternatives[0].transcript).join("\n");

        const confidence = response.results.reduce((acc: any, result: any) => {
            return acc + (result.alternatives[0].confidence || 0);
        }, 0) / response.results.length;

        return NextResponse.json(
            { transcription, confidence },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing audio:", error);
        return NextResponse.json(
            { error: "Failed to process audio" },
            { status: 500 }
        );
    }
}


