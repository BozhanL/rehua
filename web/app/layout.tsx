/* c8 ignore start */
// This is the root layout of the application.
// It does not need to be tested as it is a simple wrapper around the HTML and body tags, and does not contain any logic or state.
import './globals.css';
import Providers from '@/app/providers';
import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import type { JSX } from 'react';

// the only font used across the project
const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// page metadata, shown on the browser tab
export const metadata: Metadata = {
  title: 'Rehua',
  description: 'Digital Patient File Storage Enhancement',
  icons: '/temporary-favicon.jpg',
};

export const dynamic = 'error';

// wraps every route in the shared html/body shell and app providers
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html
      lang="en"
      className={`
        ${instrumentSans.variable}
        h-full antialiased
      `}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
