import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EezLegal - A Lawyer in Every Hand",
  description: "AI-powered legal assistant that makes legal documents and advice accessible to everyone. Get plain English translations, document generation, dispute resolution, and deal advice.",
  keywords: ["legal AI", "legal assistant", "document analysis", "legal advice", "contract review"],
  authors: [{ name: "EezLegal Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "EezLegal - A Lawyer in Every Hand",
    description: "AI-powered legal assistant for everyone",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EezLegal - A Lawyer in Every Hand",
    description: "AI-powered legal assistant for everyone",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        <div id="root">{children}</div>
        <div id="modal-root" />
      </body>
    </html>
  );
}
