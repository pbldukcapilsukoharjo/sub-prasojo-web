import type { Metadata } from "next";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import { ThemeLangProvider } from "@/providers/theme-lang-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "PRASOJO - Sistem Monitoring Disdukcapil Sukoharjo",
  description: "Sistem Monitoring Layanan Disdukcapil Sukoharjo Berbasis PRASOJO",
  icons: {
    icon: "/dukcapil-skh.png",
    shortcut: "/dukcapil-skh.png",
    apple: "/dukcapil-skh.png",
  },
};

import { Toaster } from "react-hot-toast";

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
        <script dangerouslySetInnerHTML={{ __html: themeLangScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
              <ThemeLangProvider>{children}</ThemeLangProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
