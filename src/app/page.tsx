"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Characters from "@/components/sections/Characters";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/home");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return null; // Don't render anything while redirecting
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Hero />
      <Features />
      <Characters />
      <CTA />
      <Footer />
    </main>
  );
}
