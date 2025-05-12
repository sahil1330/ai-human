/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Suspense } from "react";
import { persons } from "@/lib/personsData";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, Mic, MicOff, Volume2 } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
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

  const scrollToBottom = () => {
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
      return "Sorry, I couldn't process that.";
    }
    if (!responseData.output) {
      return { error: "No output from AI" };
    }
    return responseData.output;
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported in this browser.");
      return;
    }
    const r = new SpeechRecognition();
    if (!isListening) {
      r.lang = "en-IN";
      r.interimResults = false;
      r.maxAlternatives = 1;

      r.onstart = () => {
        setIsListening(true);
      };

      r.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        const userMessage = {
          content: transcript.trim(),
          isUser: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        await speakMessage(transcript);
      };
      r.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      r.onend = () => {
        setIsListening(false);
      };
      r.start();
    } else {
      r.stop();
    }
  };

  const speakMessage = async (message: string) => {
    setIsSpeaking(true);

    try {
      const textResponseData = await generateResponse(message);
      const audioResponse = await fetch("/api/synthesize-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textResponseData,
          voice: personData.voice,
        }),
      });

      if (!audioResponse.ok) {
        throw new Error("Failed to convert text to speech");
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
        setMessages((prev) => [
          ...prev,
          {
            content: textResponseData,
            isUser: false,
            timestamp: new Date(),
          },
        ]);
        audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Error speaking message:", error);
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
