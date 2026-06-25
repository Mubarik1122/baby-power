'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

interface Props {
  children: React.ReactNode;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export default function ConditionalLayout({
  children,
  whatsappNumber = '',
  whatsappMessage = '',
}: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton initialNumber={whatsappNumber} initialMessage={whatsappMessage} />
    </>
  );
}
