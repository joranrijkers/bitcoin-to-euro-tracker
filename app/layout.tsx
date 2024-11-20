import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { initializeApp } from './init';
import { workerService } from '@/services/worker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bitcoin to Euro Rate Tracker',
  description: 'Track real-time and historical Bitcoin to Euro conversion rates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900`}>{children}</body>
    </html>
  );
}

// Start the worker when the app starts
if (typeof window === 'undefined') { // Only run on server
  initializeApp().catch(console.error);
  workerService.start().catch(console.error);
}
