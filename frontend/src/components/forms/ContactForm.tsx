'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { submitContact } from '@/lib/api';

const inputClass =
  'w-full px-4 py-3 border border-border bg-surface text-sm text-secondary focus:outline-none focus:border-primary transition-colors';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    try {
      await submitContact({
        name: form.get('name') as string,
        email: form.get('email') as string,
        phone: form.get('phone') as string,
        company: form.get('company') as string,
        message: form.get('message') as string,
      });
      setSuccess(true);
      setToast('Message sent successfully!');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <div className="border border-border bg-linen p-8 text-center">
          <p className="font-display text-2xl text-secondary">Thank You</p>
          <p className="mt-2 text-muted text-sm">We&apos;ll be in touch within 24 hours.</p>
          <Button className="mt-6" variant="outline" onClick={() => setSuccess(false)}>
            Send Another Message
          </Button>
        </div>
        <Toast message={toast} show={!!toast} onClose={() => setToast('')} />
      </>
    );
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Full Name *</label>
          <input name="name" required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Email *</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Phone</label>
          <input name="phone" type="tel" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Company Name</label>
          <input name="company" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted mb-2">Message *</label>
        <textarea name="message" required rows={5} className={`${inputClass} resize-none`} />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button type="submit" loading={loading} size="lg">Send Message</Button>
    </form>
    <Toast message={toast} show={!!toast} onClose={() => setToast('')} />
    </>
  );
}
