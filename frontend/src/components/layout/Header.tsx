'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/types';
import Logo from '@/components/ui/Logo';
import CatalogMegaMenu from '@/components/layout/CatalogMegaMenu';
import MobileCatalogMenu from '@/components/layout/MobileCatalogMenu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const catalogCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openCatalog = useCallback(() => {
    if (catalogCloseTimer.current) clearTimeout(catalogCloseTimer.current);
    setCatalogOpen(true);
  }, []);

  const scheduleCloseCatalog = useCallback(() => {
    if (catalogCloseTimer.current) clearTimeout(catalogCloseTimer.current);
    catalogCloseTimer.current = setTimeout(() => setCatalogOpen(false), 120);
  }, []);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setCatalogOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-blush text-secondary text-center text-[10px] sm:text-xs py-2 px-4 tracking-[0.15em] uppercase font-medium">
        Initial purchase requires a minimum order — contact us for MOQ details
      </div>

      <div className="bg-primary text-white text-center text-[10px] py-2 px-4 tracking-[0.2em] uppercase font-medium">
        Trade only — retail customers please contact us for enquiries
      </div>

      <div className={`bg-surface border-b border-border transition-shadow duration-300 ${scrolled ? 'shadow-[0_4px_30px_-10px_rgba(44,44,44,0.1)]' : ''}`}>
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-[76px]'}`}>
              <button
                className="lg:hidden p-2 -ml-2 text-secondary"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
                <Logo size="lg" priority />
              </div>

              <nav className="hidden lg:flex items-center gap-7 ml-10 flex-1">
                <Link href="/" className="text-[13px] text-secondary hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-primary hover:after:w-full after:transition-all">
                  Home
                </Link>

                <span
                  className="inline-flex"
                  onMouseEnter={openCatalog}
                  onMouseLeave={scheduleCloseCatalog}
                >
                  <Link
                    href="/shop"
                    className={`flex items-center gap-1 text-[13px] transition-colors duration-300 ${
                      catalogOpen ? 'text-primary' : 'text-secondary hover:text-primary'
                    }`}
                  >
                    Catalog
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${catalogOpen ? 'rotate-180' : ''}`} />
                  </Link>
                </span>

                {navLinks.slice(1).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-secondary hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2 lg:gap-4">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-secondary hover:text-primary transition-colors duration-300"
                  aria-label="Search"
                >
                  <Search className="w-[18px] h-[18px]" />
                </button>
                <Link
                  href="/admin/login"
                  className="hidden sm:flex items-center gap-1.5 text-[13px] text-secondary hover:text-primary transition-colors duration-300"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/contact"
                  className="hidden sm:inline-flex text-[10px] uppercase tracking-[0.2em] bg-primary text-white px-5 py-2.5 hover:bg-primary-dark transition-all duration-300 hover:-translate-y-px shadow-[0_4px_14px_-4px_rgba(86,196,196,0.5)]"
                >
                  Request Account
                </Link>
              </div>
            </div>
          </div>

          <CatalogMegaMenu
            open={catalogOpen}
            categories={categories}
            onMouseEnter={openCatalog}
            onMouseLeave={scheduleCloseCatalog}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-20 pb-4 border-t border-border pt-4' : 'max-h-0'}`}>
            <form action="/shop" method="get" className="flex gap-2 max-w-lg mx-auto lg:mx-0">
              <input
                name="search"
                type="search"
                placeholder="Search our catalogue..."
                className="flex-1 px-4 py-2.5 border border-border bg-cream text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-white text-[10px] uppercase tracking-[0.2em] hover:bg-primary-dark transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-surface border-b border-border shadow-lg">
          <nav className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            <Link href="/" className="block py-3 text-sm text-secondary border-b border-border" onClick={() => setOpen(false)}>Home</Link>
            <MobileCatalogMenu categories={categories} onNavigate={() => setOpen(false)} />
            {navLinks.slice(1).map((link) => (
              <Link key={link.href} href={link.href} className="block py-3 text-sm text-secondary border-t border-border" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="block mt-4 text-center text-[10px] uppercase tracking-[0.2em] bg-primary text-white py-3.5" onClick={() => setOpen(false)}>
              Request Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
