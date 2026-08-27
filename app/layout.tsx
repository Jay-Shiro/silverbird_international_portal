import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Manrope } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Silverbird International School - Student Portal",
  description: "Student login portal for Silverbird International School.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        manrope.variable,
        "font-sans",
        geist.variable,
      )}>
      <body className="min-h-full flex flex-col bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
