import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI-Human</h3>
            <p className="text-muted-foreground">
              The future of AI conversation is here. Connect, learn, and grow with 
              intelligent AI companions.
            </p>
            <div className="flex space-x-4">
              <Github className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <div className="space-y-2">
              <Link href="/features" className="block text-muted-foreground hover:text-primary">
                Features
              </Link>
              <Link href="/pricing" className="block text-muted-foreground hover:text-primary">
                Pricing
              </Link>
              <Link href="/changelog" className="block text-muted-foreground hover:text-primary">
                Changelog
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-muted-foreground hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-primary">
                Contact
              </Link>
              <Link href="/careers" className="block text-muted-foreground hover:text-primary">
                Careers
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/cookies" className="block text-muted-foreground hover:text-primary">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          © 2024 AI-Human. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
