import type { Metadata } from 'next';
import { Libre_Baskerville, Nunito } from 'next/font/google';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { OrganizationSchema } from '@/components/seo/SEOHead';
import './globals.css';

const libreBaskerville = Libre_Baskerville({
  variable: '--font-libre',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Baby Power | Wholesale Baby Clothing',
    template: '%s',
  },
  description: 'Trade-only wholesale baby clothing. Premium bodysuits, rompers, sleepsuits and collections for retailers worldwide.',
  keywords: 'wholesale baby clothing, baby bodysuits, baby rompers, baby power wholesale',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${nunito.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col antialiased">
        <OrganizationSchema />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
