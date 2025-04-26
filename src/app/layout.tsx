import React from "react";
import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans } from 'next/font/google';
import "../styles/globals.css";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Sidebar from "../components/layout/sidebar";
import { LanguageProvider } from "@/context/language-context";
import Providers from "./providers";

// Import Sonner in a client component
import ClientToaster from "@/components/client-toaster";

// Font configuration for Latin script (English)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

// Font configuration for Nepali text
const noto = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto',
  preload: true,
});

// Enhanced metadata for better SEO and social sharing
export const metadata: Metadata = {
  title: {
    template: '%s | Nepal eGovernance Polling System',
    default: 'Nepal eGovernance Polling System',
  },
  description: 'Official digital democracy platform for Nepal - Government polling and citizen engagement portal',
  applicationName: 'Nepal eGovernance Polling',
  authors: [{ name: 'Government of Nepal', url: 'https://nepal.gov.np' }],
  keywords: [
    'Nepal', 
    'eGovernance', 
    'polling', 
    'voting', 
    'citizen engagement', 
    'digital democracy',
    'e-governance',
    'online voting',
    'electronic polling',
    'citizen participation',
    'government portal'
  ],
  openGraph: {
    title: 'Nepal eGovernance Polling System',
    description: 'Digital democracy platform for Nepal',
    locale: 'en_US',
    type: 'website',
    siteName: 'Nepal eGovernance Polling',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nepal eGovernance Polling System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nepal eGovernance Polling System',
    description: 'Digital democracy platform for Nepal',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png' }],
    shortcut: ['/shortcut-icon.png'],
  },
  alternates: {
    languages: {
      'en': '/en',
      'ne': '/ne',
    },
  },
  manifest: '/site.webmanifest',
  category: 'government',
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${noto.variable} scroll-smooth`} 
      suppressHydrationWarning
    >
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Global print styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            header, footer, nav, aside, .no-print {
              display: none !important;
            }
            body, main {
              background: white !important;
              color: black !important;
            }
            main {
              padding: 0 !important;
              margin: 0 !important;
            }
            @page {
              margin: 1.5cm;
            }
          }
        `}} />
      </head>
      
      <body className={`${inter.className} antialiased bg-background min-h-screen font-sans`}>
        <Providers>
          <LanguageProvider>
            {/* Main layout structure */}
            <div className="min-h-screen flex flex-col">
              {/* Nepal flag-inspired color strip */}
              <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-blue-700" aria-hidden="true"></div>
              
              {/* Header */}
              <Header />
              
              {/* Main content area with improved responsive layout */}
              <div className="flex flex-1 flex-col lg:flex-row">
                <Sidebar />
                <main 
                  id="main-content" 
                  className="flex-1 p-3 md:p-6 transition-all"
                >
                  {/* Content container with max width for better readability */}
                  <div className="max-w-7xl mx-auto w-full">
                    {children}
                  </div>
                </main>
              </div>
              
              {/* Footer */}
              <Footer />
              
              {/* Bottom Nepal flag-inspired color strip */}
              <div className="h-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-red-600" aria-hidden="true"></div>
            </div>
            
            {/* Client-side Sonner toast integration */}
            
          </LanguageProvider>
        </Providers>
        
        {/* Bilingual no-JS fallback notice */}
        <noscript>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4">
            <div className="max-w-md rounded-lg bg-card p-6 shadow-lg border border-red-100">
              <div className="flex flex-col space-y-4">
                {/* English message */}
                <div className="space-y-2 text-center border-b border-gray-200 pb-4">
                  <h1 className="text-lg font-semibold text-red-800">JavaScript is required</h1>
                  <p className="text-sm text-muted-foreground">
                    This application requires JavaScript to function properly. Please enable JavaScript in your browser settings.
                  </p>
                </div>
                
                {/* Nepali message */}
                <div className="space-y-2 text-center font-noto pt-2">
                  <h1 className="text-lg font-semibold text-red-800">जाभास्क्रिप्ट आवश्यक छ</h1>
                  <p className="text-sm text-muted-foreground">
                    यो एप्लिकेसन सही तरिकाले काम गर्नको लागि जाभास्क्रिप्ट आवश्यक छ। कृपया आफ्नो ब्राउजर सेटिङमा जाभास्क्रिप्ट सक्षम गर्नुहोस्।
                  </p>
                </div>
                
                {/* Nepal emblem */}
                <div className="flex justify-center py-2">
                  <img 
                    src="/images/nepal-emblem.png" 
                    alt="Nepal Government Emblem" 
                    width={64} 
                    height={64} 
                    className="opacity-70"
                  />
                </div>
              </div>
            </div>
          </div>
        </noscript>
      </body>
    </html>
  );
}