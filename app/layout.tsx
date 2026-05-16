import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'brand.ai - The Architecture of Living Brand Systems',
  description: 'A Technical Analysis of Brand.ai and the Engineering of Identity in Generative Environments',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
