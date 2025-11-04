import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Result Sync — Where RGPV Meets Automation",
  description:
    "Result Sync is your smart RGPV result extractor that fetches and syncs student results automatically. Fast, reliable, and effortless — experience automation at resultsync.vercel.app.",
  keywords: [
    "RGPV",
    "RGPV Result",
    "RGPV Result Extractor",
    "Result Sync",
    "RGPV Automation",
    "RGPV Result Checker",
    "RGPV Marks",
    "RGPV Student Portal",
  ],
  authors: [{ name: "Result Sync Team" }],
  openGraph: {
    title: "Result Sync — Where RGPV Meets Automation",
    description:
      "Automatically extract and sync your RGPV results in seconds. Smart, simple, and fast — visit resultsync.vercel.app.",
    url: "https://resultsync.vercel.app",
    siteName: "Result Sync",
    images: [
      {
        url: "https://resultsync.vercel.app/og-image.png", // replace with your OG image
        width: 1200,
        height: 630,
        alt: "Result Sync - RGPV Result Extractor",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  metadataBase: new URL("https://resultsync.vercel.app"),
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {children}
        <Navbar/>
      </body>
    </html>
  );
}
