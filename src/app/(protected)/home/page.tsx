import { Card, CardDescription, CardTitle } from "@/components/cards-demo-3";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { persons } from "@/lib/personsData";
import { MessageCircle, Users, Sparkles } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header with stats */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Companions
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Choose your perfect AI companion for engaging conversations and
              meaningful connections
            </p>

            {/* Quick stats */}
            <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{persons.length} Companions</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span>Voice & Text Chat</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>

          {/* Character Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {persons.map((person) => (
              <Card
                key={person.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border/50"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={person.image}
                    fill
                    alt={person.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm">
                      AI Companion
                    </span>
                  </div>

                  {/* Status indicator */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white font-medium">
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                      {person.name}
                    </CardTitle>

                    <CardDescription className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {person.description}
                    </CardDescription>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link
                      href={person.link}
                      className="flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Start Conversation</span>
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Bottom info */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50">
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm text-muted-foreground">
                Each companion has unique personality traits and conversation
                styles
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
