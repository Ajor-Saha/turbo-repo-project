import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Secure Transactions Manager | AES-256-GCM Encryption",
  description: "Create, view, and decrypt encrypted transactions using AES-256-GCM envelope encryption. Built with Next.js, Fastify, and TurboRepo.",
  keywords: ["encryption", "AES-256-GCM", "secure transactions", "envelope encryption", "cryptography"],
  authors: [{ name: "Secure Transactions Team" }],
  openGraph: {
    title: "Secure Transactions Manager",
    description: "Enterprise-grade transaction encryption with AES-256-GCM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
