import Link from 'next/link';
import { BRAND_NAME } from '@/lib/brand';
import Logo from '@/components/ui/Logo';
import PoweredBy4sov from '@/components/ui/PoweredBy4sov';

const footerLinks = {
  shop: [
    { href: '/shop', label: 'All Products' },
    { href: '/shop/baby-bodysuits', label: 'Baby Bodysuits' },
    { href: '/shop/baby-rompers', label: 'Baby Rompers' },
    { href: '/shop/baby-sleepsuits', label: 'Baby Sleepsuits' },
    { href: '/shop/baby-sets', label: 'Baby Sets' },
    { href: '/shop/baby-blankets', label: 'Blankets' },
    { href: '/shop/baby-accessories', label: 'Accessories' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/admin/login', label: 'Login' },
    { href: '/contact', label: 'Request Account' },
  ],
  policies: [
    { href: '/return-policy', label: 'Return & Refund Policy' },
    { href: '/shipping-policy', label: 'Shipping Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-linen border-t border-border mt-auto relative grain">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-linen border border-border flex items-center justify-center">
        <span className="text-gold text-xs">✦</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 lg:pt-20 lg:pb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Logo size="md" />
            <p className="mt-5 text-muted text-sm leading-[1.8] max-w-xs font-light">
              Premium wholesale baby clothing for trade customers who value quality, craftsmanship, and timeless design.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-secondary mb-5">Catalog</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors duration-300 font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-secondary mb-5">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors duration-300 font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-secondary mb-5">Policies</h3>
            <ul className="space-y-3">
              {footerLinks.policies.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-primary transition-colors duration-300 font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ornament-divider max-w-md mx-auto mt-14 mb-8">
          <span className="text-gold text-xs">✦</span>
        </div>

        <p className="text-center text-muted text-[11px] tracking-[0.1em] font-light" suppressHydrationWarning>
          &copy; {new Date().getFullYear()}, {BRAND_NAME}. All rights reserved.
        </p>

        <div className="flex justify-center mt-6">
          <PoweredBy4sov />
        </div>
      </div>
    </footer>
  );
}
