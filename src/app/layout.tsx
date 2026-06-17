import type { Metadata } from "next";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import { ThemeLangProvider } from "@/providers/theme-lang-provider";

import Script from "next/script";

export const metadata: Metadata = {
  title: "Sub Prasojo Web",
  description: "Web application for Sub Prasojo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeLangScript = `
    try {
      var theme = localStorage.getItem('theme-hex');
      var lang = localStorage.getItem('lang');
      if (theme) {
        document.documentElement.style.setProperty('--color-primary', theme);
      }
      if (lang) {
        document.documentElement.lang = lang;
      }
    } catch (e) {}
  `;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <Script id="theme-lang-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeLangScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeLangProvider>{children}</ThemeLangProvider>
      </body>
    </html>
  );
}
