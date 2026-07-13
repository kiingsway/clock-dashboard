import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Eruda from "@/helpers/Eruda";
import { RegisterSW } from "@/utils/RegisterSW";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clock Dashboard",
  description: "Weather and Clock Dashboard",
  manifest: "/manifest.json",
  themeColor: "#101010",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <RegisterSW />
      <body className="min-h-full flex flex-col">{children}</body>
      <Eruda />
    </html>
  );
}
