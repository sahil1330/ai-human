import { NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Initialize the client on the server side
const textToSpeechClient = new TextToSpeechClient({
  // Use environment variables instead of hardcoding credentials
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  // Don't include private keys directly in code
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text parameter is required' },
        { status: 400 }
      );
    }

    const [response] = await textToSpeechClient.synthesizeSpeech({
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    // Return the audio content as base64
    return NextResponse.json({ 
      audioContent: response.audioContent
    });
    
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return NextResponse.json(
      { error: 'Failed to process text to speech' },
      { status: 500 }
    );
  }
}
