import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spider-Society Mainframe | First PR Festival",
  description:
    "A live roster of every contributor who merged their first Pull Request at the First PR Festival: Intro to Github and Open Source.",
  openGraph: {
    title: "Spider-Society Mainframe",
    description: "First PR Festival : Intro to Github and Open Source",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ink font-body antialiased">
        {children}
      </body>
    </html>
  );
}
