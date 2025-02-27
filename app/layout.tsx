import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavWrapper from "./components/NavWrapper";
import AuthProviderWrapper from "@/lib/firebase/AuthProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Need To Fuel",
  description: "Where Luxury Meets Convenience",
};

export default function RootLayout({
  children,
}: Readonly<{ 
  children: React.ReactNode;
 }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
        >
        <AuthProviderWrapper>
          {children}
          <NavWrapper />
          {/* <TOS_ /> */}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
