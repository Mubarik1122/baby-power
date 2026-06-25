'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderOpen, Users, HelpCircle,
  FileText, LogOut, Menu, X, ImageIcon, Settings,
} from 'lucide-react';
import { useState } from 'react';
import { removeToken } from '@/lib/auth';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/Logo';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    router.push('/admin/login');
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="bg-cream rounded-lg px-2 py-1">
            <Logo size="sm" href={null} />
          </div>
          <span className="text-white font-bold font-display text-sm">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                active ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-secondary text-white rounded-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className="hidden lg:block w-64 bg-secondary shrink-0 min-h-screen">
        {sidebar}
      </aside>

      {open && (
        <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-secondary z-40 shadow-2xl">
          {sidebar}
        </aside>
      )}
    </>
  );
}
