import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";

import "./globals.css";

const fontSans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontDisplay = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "MoodMarket",
  description: "Oppdag globale trender før de blir mainstream"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body className={`${fontSans.variable} ${fontDisplay.variable} antialiased`}>{children}</body>
    </html>
  );
}
