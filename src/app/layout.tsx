import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ritual Coach - Hindu Religious Practices Guide",
  description: "AI-powered guidance for authentic Hindu rituals, festivals, and daily spiritual practices. Supporting South & North Indian traditions with multilingual content.",
  keywords: "Hindu rituals, puja, festivals, Sanskrit mantras, spiritual practices, Vedic traditions",
  authors: [{ name: "Ritual Coach" }],
  openGraph: {
    title: "Ritual Coach - Hindu Religious Practices Guide",
    description: "AI-powered guidance for authentic Hindu rituals and festivals",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
