'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/api';
import { setToken } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    try {
      const res = await adminLogin(
        form.get('email') as string,
        form.get('password') as string
      );
      setToken(res.token);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-light via-cream to-blush p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Logo size="lg" href={null} />
          </div>
          <h1 className="text-2xl font-bold text-secondary font-display">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to manage Little Star</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
