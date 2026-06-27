import type { Metadata } from 'next';
import { Libre_Baskerville, Nunito } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { OrganizationSchema } from '@/components/seo/SEOHead';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand';

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
    default: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    template: '%s',
  },
  description: 'Trade-only wholesale baby clothing. Premium bodysuits, rompers, sleepsuits and collections for retailers worldwide.',
  keywords: 'wholesale baby clothing, baby bodysuits, baby rompers, little star wholesale',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${nunito.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <OrganizationSchema />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
