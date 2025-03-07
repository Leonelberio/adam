import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import QueryProvider from "./queryproviders";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pensées | Plateforme de partage d'idées",
  description: "Une plateforme collaborative pour partager et connecter des idées",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <Providers>
            {children}
            <Toaster
              position="top-center"
              expand={true}
              richColors
              closeButton
              theme="light"
            />
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
