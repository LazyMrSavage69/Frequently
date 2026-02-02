import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Admin Info - Informations administratives officielles",
    template: "%s | Admin Info"
  },
  description: "Trouvez rapidement des réponses à vos questions administratives. Démarches, documents, procédures - toutes les informations officielles en un seul endroit.",
  keywords: ["administration", "démarches", "documents", "procédures", "informations officielles"],
  authors: [{ name: "Admin Info" }],
  creator: "Admin Info",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://admin-info.fr",
    siteName: "Admin Info",
    title: "Admin Info - Informations administratives officielles",
    description: "Trouvez rapidement des réponses à vos questions administratives officelles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin Info - Informations administratives officielles",
    description: "Trouvez rapidement des réponses à vos questions administratives officelles.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1890820878027650"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
