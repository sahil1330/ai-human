"use client";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Mic, Shield, Zap, Heart, GraduationCap } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Natural Conversations",
    description: "Engage in meaningful, context-aware conversations that feel real and personal."
  },
  {
    icon: Mic,
    title: "Voice Interactions",
    description: "Talk naturally with speech recognition and realistic voice responses."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your conversations are secure and private. We never store sensitive data."
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description: "Get immediate, thoughtful responses powered by advanced AI technology."
  },
  {
    icon: Heart,
    title: "Emotional Intelligence",
    description: "AI companions that understand emotions and respond with empathy."
  },
  {
    icon: GraduationCap,
    title: "Learn & Grow",
    description: "Educational conversations that help you learn new things every day."
  }
];

export default function Features() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Why Choose AI-Human?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the next generation of AI interaction with features designed 
            to make every conversation meaningful and engaging.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
