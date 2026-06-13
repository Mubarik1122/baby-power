'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken, removeToken } from '@/lib/auth';
import { getMe } from '@/lib/api';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const token = getToken();

      if (!token && pathname !== '/admin/login') {
        router.replace('/admin/login');
        return;
      }

      if (token && pathname === '/admin/login') {
        router.replace('/admin');
        return;
      }

      if (token && pathname !== '/admin/login') {
        try {
          await getMe(token);
          if (!cancelled) setReady(true);
        } catch {
          removeToken();
          router.replace('/admin/login');
        }
        return;
      }

      if (!cancelled) setReady(true);
    }

    setReady(false);
    verify();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
