import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AegisBTC | Premium sBTC Yield Protocol",
  description: "Deposit sBTC, stream yield, and secure your transactions with AI risk analysis.",
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-surface-950 text-foreground antialiased relative selection:bg-primary-500/30 flex flex-col`}>
        {/* Ambient background glows */}
        <div className="fixed top-0 -left-1/4 w-[500px] h-[500px] bg-primary-900/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed top-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[150px] pointer-events-none" />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1A1817',
              color: '#fff',
              border: '1px solid rgba(249, 115, 22, 0.2)',
              borderRadius: '16px',
            },
            success: {
              iconTheme: {
                primary: '#f97316',
                secondary: '#FFFAEE',
              },
            },
          }}
        />

        <Navbar />
        <main className="relative z-10 pt-24 pb-16 min-h-screen flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
