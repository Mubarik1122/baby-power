import type { Metadata } from 'next';
import { Libre_Baskerville, Nunito } from 'next/font/google';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { OrganizationSchema } from '@/components/seo/SEOHead';
import { getSettings } from '@/lib/api';
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let whatsappNumber = '';
  let whatsappMessage = '';

  try {
    const res = await getSettings();
    whatsappNumber = res.data.whatsappNumber || '';
    whatsappMessage = res.data.whatsappMessage || '';
  } catch {
    // Button can still use NEXT_PUBLIC_WHATSAPP_NUMBER fallback.
  }

  return (
    <html lang="en" className={`${libreBaskerville.variable} ${nunito.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <OrganizationSchema />
        <ConditionalLayout whatsappNumber={whatsappNumber} whatsappMessage={whatsappMessage}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
