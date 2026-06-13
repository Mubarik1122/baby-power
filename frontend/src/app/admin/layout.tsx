'use client';

import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return <AdminGuard>{children}</AdminGuard>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}
