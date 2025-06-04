// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import {
//   UserButton,
//   SignInButton,
//   SignUpButton,
//   useUser
// } from "@clerk/nextjs";

// function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { isSignedIn } = useUser();

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex justify-between items-center">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-3 group">
//             <div className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">
//               AI Human
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
//             <li className="hover:text-accent transition-colors">
//               <Link href="/">Home</Link>
//             </li>
//             <li className="hover:text-accent transition-colors">
//               <Link href="/features">Features</Link>
//             </li>
//             <li className="hover:text-accent transition-colors">
//               <Link href="/chat">Start Chat</Link>
//             </li>
//             <li className="hover:text-accent transition-colors">
//               <Link href="/about">About</Link>
//             </li>
//           </ul>

//           {/* Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             {!isSignedIn ? (
//               <>
//                 <SignInButton mode="modal">
//                   <button className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium text-secondary-foreground">
//                     Sign In
//                   </button>
//                 </SignInButton>
//                 <SignUpButton mode="modal">
//                   <button className="px-4 py-2 rounded-full bg-accent hover:bg-accent/80 transition-colors text-sm font-medium text-accent-foreground">
//                     Sign Up
//                   </button>
//                 </SignUpButton>
//               </>
//             ) : (
//               <UserButton afterSignOutUrl="/" />
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={toggleMenu}
//               className="p-2 rounded-lg hover:bg-secondary/20 transition-colors focus:outline-none"
//               aria-label="Toggle menu"
//             >
//               {!isMenuOpen ? (
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 6h16M4 12h16m-7 6h7"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden absolute w-full bg-secondary shadow-lg">
//           <div className="px-4 py-3 space-y-3">
//             <Link
//               href="/"
//               className="block py-2 px-3 rounded-lg hover:bg-secondary/20 transition-colors"
//               onClick={toggleMenu}
//             >
//               Home
//             </Link>
//             <Link
//               href="/features"
//               className="block py-2 px-3 rounded-lg hover:bg-secondary/20 transition-colors"
//               onClick={toggleMenu}
//             >
//               Features
//             </Link>
//             <Link
//               href="/chat"
//               className="block py-2 px-3 rounded-lg hover:bg-secondary/20 transition-colors"
//               onClick={toggleMenu}
//             >
//               Start Chat
//             </Link>
//             <Link
//               href="/about"
//               className="block py-2 px-3 rounded-lg hover:bg-secondary/20 transition-colors"
//               onClick={toggleMenu}
//             >
//               About
//             </Link>
//             {!isSignedIn ? (
//               <div className="space-y-2 pt-3 border-t border-border">
//                 <SignInButton mode="modal">
//                   <button className="w-full py-2 text-center rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
//                     Sign In
//                   </button>
//                 </SignInButton>
//                 <SignUpButton mode="modal">
//                   <button className="w-full py-2 text-center rounded-lg bg-accent hover:bg-accent/80 transition-colors text-accent-foreground">
//                     Sign Up
//                   </button>
//                 </SignUpButton>
//               </div>
//             ) : (
//               <div className="pt-3 border-t border-border flex justify-center">
//                 <UserButton afterSignOutUrl="/" />
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;
"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();
  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">

          {!isSignedIn ? (
            <NavbarButton
              variant="primary"
              onClick={() => router.push("/sign-in")}
            >
              Login
            </NavbarButton>
          ) : (
            <UserButton afterSwitchSessionUrl="/" />
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            {!isSignedIn ? (
              <SignInButton mode="modal" oauthFlow="popup">
                <button className="w-full py-2 text-center rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <UserButton afterSwitchSessionUrl="/" />
            )}
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Book a call
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
