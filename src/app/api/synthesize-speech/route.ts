import { NextRequest, NextResponse } from "next/server";
import textToSpeech from "@google-cloud/text-to-speech";

export async function POST(request: NextRequest) {
  const { text, voice } = await request.json();
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    return new Response("Missing Google service account key", { status: 500 });
  }

  const serviceAccountKey = JSON.parse(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string
  );
  const client = new textToSpeech.TextToSpeechClient({
    credentials: serviceAccountKey,
  });
  if (!text) {
    return new Response("Missing text or voice", { status: 400 });
  }
  if (!voice) {
    return new Response("Missing voice", { status: 400 });
  }
  if (text.length > 200) {
    return new Response("Text is too long", { status: 400 });
  }
  const voiceRequest = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: {
      languageCode: "en-IN",
      ssmlGender: "NEUTRAL" as const,
      name: voice,
    },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" as const },
  };

  const [response] = await client.synthesizeSpeech(voiceRequest);
  const audioContent = response?.audioContent;
  if (!audioContent) {
    return new Response("No audio content received", { status: 500 });
  }
  return new NextResponse(audioContent, {
    status: 200,
  });
}
