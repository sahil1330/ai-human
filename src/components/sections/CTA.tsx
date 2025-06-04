"use client";
import { motion } from "motion/react";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <span className="text-lg font-medium text-muted-foreground">
              Ready to Start?
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold">
            Begin Your AI Journey Today
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who have discovered the future of AI interaction. 
            Create your account and start chatting with your perfect AI companion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="group px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpButton>
          </div>
          
          <div className="text-sm text-muted-foreground">
            No credit card required • Free forever plan available
          </div>
        </motion.div>
      </div>
    </section>
  );
}
