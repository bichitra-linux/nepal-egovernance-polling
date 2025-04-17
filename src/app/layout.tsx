import React from "react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "../styles/globals.css";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Sidebar from "../components/layout/sidebar";
import { LanguageProvider } from "@/context/language-context";
import Providers from "./providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nepal eGovernance Polling System',
  description: 'Digital democracy platform for Nepal',
};

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en" className="hydrated" suppressHydrationWarning>
        <body className={inter.className}>
        <Providers>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-4">{children}</main>
              </div>
              <Footer />
            </div>
          </LanguageProvider>
        </Providers>
        </body>
      </html>
    );
  }
