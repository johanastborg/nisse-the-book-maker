import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nisse Book Maker | Autonomous Academic Publisher",
  description: "Lovable-style AI multi-agent textbook and monograph publishing pipeline powered by Gemini and Typst.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* KaTeX CSS for mathematical equations */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          crossOrigin="anonymous"
        />
        {/* Google Fonts: Outfit (UI), EB Garamond (Academic Serif), JetBrains Mono (Code/Typst) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=JetBrains+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
