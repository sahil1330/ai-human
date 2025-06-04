"use client";
import { motion } from "motion/react";
import { SignUpButton } from "@clerk/nextjs";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle, Mic } from "lucide-react";

export default function Hero() {
  return (
    <HeroHighlight>
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <span className="text-lg font-medium text-muted-foreground">
                AI Powered Conversations
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              Connect with Your{" "}
              <Highlight className="text-black dark:text-white">
                AI Companions
              </Highlight>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience meaningful conversations with AI personalities tailored to your needs. 
              From friendship to learning, discover your perfect digital companion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <SignUpButton mode="modal">
                <Button size="lg" className="group relative overflow-hidden px-8 py-4 text-lg">
                  <span className="relative z-10 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Start Chatting Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </SignUpButton>
              
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                <Mic className="h-5 w-5 mr-2" />
                Try Voice Chat
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">9+</div>
                <div className="text-sm text-muted-foreground">AI Personalities</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </HeroHighlight>
  );
}
