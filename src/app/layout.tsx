import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import Providers from './providers';
import MotionProvider from '../components/MotionProvider';
import '../index.css';

import { AppProvider } from '../context/AppContext';
import NavigationLayout from '../components/NavigationLayout';

export const metadata: Metadata = {
  metadataBase: new URL('https://kaaktaal-v2.vercel.app'),
  title: 'Kaaktaal Chronology',
  description: 'Kaaktaal — Coincidence & Serendipity. An archival collection of music, stories, and memories.',
  keywords: ['Kaaktaal', 'Band', 'Music', 'Chronology', 'Archive', 'Bangladesh', 'Bengali indie'],
  authors: [{ name: 'Kaaktaal' }],
  icons: {
    icon: {
      url: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/logo%20grey%20black.png',
      type: 'image/png',
    },
  },
  openGraph: {
    title: 'Kaaktaal Chronology',
    description: 'Kaaktaal — Coincidence & Serendipity. An archival collection.',
    url: 'https://kaaktaal-v2.vercel.app',
    siteName: 'Kaaktaal Chronology',
    images: [
      {
        url: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/logo%20grey%20black.png',
        width: 800,
        height: 600,
        alt: 'Kaaktaal Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaaktaal Chronology',
    description: 'An archival collection of Kaaktaal\'s music and memories.',
    images: ['https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/logo%20grey%20black.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
          <Providers>
            <AppProvider>
              <NavigationLayout>
                {children}
              </NavigationLayout>
            </AppProvider>
          </Providers>
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}

