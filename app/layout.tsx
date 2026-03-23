import type { Metadata } from 'next';
import { ThemeRegistry } from '@/components/ThemeRegistry';

export const metadata: Metadata = {
  title: 'Threadoc',
  description: 'TD collaborative reading and annotation workspace',
  icons: {
    icon: '/td-logo.svg',
    shortcut: '/td-logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
