/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Suspense, useCallback } from "react";
import { persons } from "@/lib/personsData";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, Mic, MicOff, Volume2 } from "lucide-react";
import { toast } from "sonner";
// This is the main page component - it's server-side
export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatContent />
    </Suspense>
  );
}

// Simple loading state
function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg font-medium text-muted-foreground">
          Loading chat...
        </p>
      </div>
    </div>
  );
}

// The actual chat content as a client component with useSearchParams
// eslint-disable-next-line @typescript-eslint/no-unused-expressions

function ChatContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const personData =
    persons.find((person) => person.name === name) || persons[0];
  const { image, description } = personData;
  console.log("name", name);
  const [messages, setMessages] = useState<
    {
      content: string;
      isUser: boolean;
      timestamp: Date;
    }[]
  >([
    {
      content: `Hi there! I'm ${personData.name}. ${description} How are you today?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [isAiTyping, setIsAiTyping] = useState(false);

  const [formattedMessages, setFormattedMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  // Scroll to bottom when messages change

  useEffect(() => {
    if (error) {
      toast.error(error, {
        richColors: true,
        duration: 5000,
        position: "bottom-right",
        action: {
          label: "Dismiss",
          onClick: () => setError(null),
        },
      });
    }
    setError(null);
  }, [error]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Format times client-side to avoid hydration mismatch
    setFormattedMessages(
      messages.map((message) => ({
        ...message,
        formattedTime: formatTime(message.timestamp),
      }))
    );
  }, [messages]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    // Add AI typing indicator
    setIsAiTyping(true);
    // Add user message
    const userMessage = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response (to be replaced with actual API call)
    setTimeout(async () => {
      const aiResponse = {
        content: await generateResponse(input),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
    // Remove AI typing indicator
    setIsAiTyping(false);
  };

  const generateResponse = async (userInput: string) => {
    const response = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: userInput, prompt: personData.prompt }),
    });
    const responseData = await response.json();
    if (responseData.error) {
      console.error("Error from AI:", responseData.error);
      setError(responseData.error);
      return "Sorry, I couldn't process that.";
    }
    if (!responseData.output) {
      setError("No output from AI");
      return { error: "No output from AI" };
    }
    return responseData.output;
  };

  const toggleListening = useCallback(async () => {
    // setIsListening(!isListening);
    // const SpeechRecognition =
    //   (window as any).SpeechRecognition ||
    //   (window as any).webkitSpeechRecognition;
    // if (!SpeechRecognition) {
    //   console.error("SpeechRecognition not supported in this browser.");
    //   return;
    // }
    // const r = new SpeechRecognition();
    // if (!isListening) {
    //   r.lang = "en-IN";
    //   r.interimResults = false;
    //   r.maxAlternatives = 1;

    //   r.onstart = () => {
    //     setIsListening(true);
    //   };

    //   r.onresult = async (event: any) => {
    //     const transcript = event.results[0][0].transcript;
    //     setInput(transcript);
    //     const userMessage = {
    //       content: transcript.trim(),
    //       isUser: true,
    //       timestamp: new Date(),
    //     };
    //     setMessages((prev) => [...prev, userMessage]);
    //     await speakMessage(transcript);
    //   };
    //   r.onerror = (event: any) => {
    //     console.error("Speech recognition error", event.error);
    //     setIsListening(false);
    //   };
    //   r.onend = () => {
    //     setIsListening(false);
    //   };
    //   r.start();
    // } else {
    //   r.stop();
    // }

    setIsListening(!isListening);

    if (!isListening) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        streamRef.current = stream;

        let mimeType = "audio/webm;codecs=opus";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "audio/webm";
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = "audio/wav";
          }
        }

        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: mimeType,
        });

        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorderRef.current?.mimeType,
          });
          await transcribeAudio(audioBlob);

          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        };

        mediaRecorderRef.current.start();
        mediaRecorderRef.current.onstart = () => {
          setIsListening(true);
        };
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setError("Could not access microphone. Please check permissions.");
        setIsListening(false);
      }
    } else {
      if (mediaRecorderRef.current && isListening) {
        mediaRecorderRef.current.stop();
        setIsListening(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      }
    }
  }, [isListening]);

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("/api/get-Ai-response", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Transcription error:", errorData);
        setError(errorData.error || "Transcription failed");
        throw new Error(errorData.error || "Transcription failed");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          content: data.transcription,
          isUser: true,
          timestamp: new Date(),
        },
      ]);

      if (data.transcription && data.transcription.trim()) {
        const textResponseData = await generateResponse(
          data.transcription.trim()
        );
        await speakMessage(textResponseData);
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const speakMessage = async (message: string) => {
    setIsSpeaking(true);

    try {
      const audioResponse = await fetch("/api/synthesize-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
          voice: personData.voice,
        }),
      });

      if (!audioResponse.ok) {
        throw new Error("Failed to convert text to speech");
        setError("Failed to convert text to speech");
        setIsSpeaking(false);
      }

      const audioBlob = await audioResponse.blob();

      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        if (!messages.some((msg) => msg.content === message)) {
          // Only add the message if it doesn't already exist
          setMessages((prev) => [
            ...prev,
            {
              content: message,
              isUser: false,
              timestamp: new Date(),
            },
          ]);
        }
        audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Error speaking message:", error);
      setError("Failed to convert text to speech");
      setIsSpeaking(false);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Character info header */}
      <div className="bg-card p-4 border-b border-border flex items-center space-x-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary">
          <Image
            src={image}
            alt={personData.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-card-foreground">
            {personData.name}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {description}
          </p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-background/50 space-y-4">
        {formattedMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col max-w-[75%]">
              <div
                className={`p-3 rounded-2xl ${
                  message.isUser
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary text-secondary-foreground rounded-bl-none"
                }`}
              >
                {message.content}
                <br />
                {isAiTyping && !message.isUser && (
                  <span className="text-xs text-muted-foreground">
                    Typing...
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs text-muted-foreground">
                  {message.formattedTime}
                </span>
                {!message.isUser && (
                  <button
                    onClick={() => speakMessage(message.content)}
                    className={`p-1 rounded-full ${
                      isSpeaking
                        ? "text-accent bg-accent/20"
                        : "text-muted-foreground hover:text-accent"
                    }`}
                    disabled={isSpeaking}
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full ${
              isListening
                ? "bg-destructive text-destructive-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-full bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className={`p-3 rounded-full ${
              input.trim()
                ? "bg-accent text-accent-foreground hover:bg-accent/80"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Send size={20} />
          </button>
        </div>

        {/* Voice input indicator */}
        {isListening && (
          <div className="mt-2 text-center text-sm text-accent animate-pulse">
            Listening... Speak now
          </div>
        )}
      </div>
    </div>
  );
}
