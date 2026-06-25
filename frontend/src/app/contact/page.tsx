import { Metadata } from 'next';
import { generateSEO } from '@/components/seo/SEOHead';
import ContactForm from '@/components/forms/ContactForm';
import PageBanner from '@/components/ui/PageBanner';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { getPageBySlug } from '@/lib/api';
import { Page } from '@/lib/types';

type ContactExtras = {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
};

const defaultContact = {
  address: '123 Textile Lane, Manchester, M1 1AA, UK',
  phone: '+44 123 456 7890',
  email: 'info@babypower.com',
  hours: 'Mon – Fri: 9:00 AM – 6:00 PM GMT',
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await getPageBySlug('contact');
    const page = res.data;
    return generateSEO({
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription || 'Contact Baby Power for wholesale enquiries.',
      path: '/contact',
    });
  } catch {
    return generateSEO({
      title: 'Contact Us',
      description: 'Get in touch with Baby Power for wholesale enquiries.',
      path: '/contact',
    });
  }
}

export default async function ContactPage() {
  let page: Page | null = null;

  try {
    const res = await getPageBySlug('contact');
    page = res.data;
  } catch {
    // use defaults
  }

  const extras = { ...defaultContact, ...(page?.extras as ContactExtras) };
  const contactItems = [
    { icon: MapPin, title: 'Address', text: extras.address },
    { icon: Phone, title: 'Phone', text: extras.phone },
    { icon: Mail, title: 'Email', text: extras.email },
    { icon: Clock, title: 'Hours', text: extras.hours },
  ];

  return (
    <div>
      <PageBanner
        title={page?.title || 'Contact Us'}
        subtitle={page?.subtitle || 'Request a trade account or send us an enquiry — we respond within 24 hours'}
        image="/banners/contact-hero.jpg"
      />

      <section className="py-14 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="space-y-8">
              {contactItems.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-secondary">{item.title}</h3>
                    <p className="text-muted text-sm mt-1">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2 border border-border bg-cream p-8 lg:p-10">
              <h2 className="font-display text-2xl text-secondary mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
