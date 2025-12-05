import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/providers/CartProvider';
import { StackProvider } from '@stackframe/stack';
import { stackServerApp } from '@/stack/server';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PromoBanner } from '@/components/marketing/PromoBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://vellore-directory.vercel.app'),
  title: {
    default: 'Vellore Directory | Find Local Businesses in Vellore, Tamil Nadu',
    template: '%s | Vellore Directory',
  },
  description: 'Discover the best local businesses, restaurants, hospitals, shops, and services in Vellore, Tamil Nadu. Browse by category, book appointments, and connect via WhatsApp.',
  keywords: ['Vellore businesses', 'local directory', 'Vellore services', 'restaurants in Vellore', 'hospitals in Vellore', 'shops near me', 'Vellore Tamil Nadu', 'business directory'],
  authors: [{ name: 'Vellore Directory' }],
  creator: 'Vellore Directory',
  publisher: 'Vellore Directory',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://vellore-directory.vercel.app',
    title: 'Vellore Directory | Find Local Businesses in Vellore',
    description: 'Discover the best local businesses in Vellore, Tamil Nadu. Browse categories, book appointments, and connect via WhatsApp.',
    siteName: 'Vellore Directory',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vellore Directory - Local Business Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vellore Directory | Find Local Businesses in Vellore',
    description: 'Discover the best local businesses in Vellore, Tamil Nadu.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className={inter.className}>
        <StackProvider app={stackServerApp}>
          <CartProvider>
            <PromoBanner />
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </StackProvider>
      </body>
    </html>
  );
}
