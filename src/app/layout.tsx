import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import Providers from './providers';
import '../index.css';

export const metadata: Metadata = {
  title: 'Kaaktaal Chronology',
  description: 'Kaaktaal — Coincidence & Serendipity. An archival collection.',
  icons: {
    icon: {
      url: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/logo%20grey%20black.png',
      type: 'image/png',
    },
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
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}

