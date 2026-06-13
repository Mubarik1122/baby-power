'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { submitQuotation } from '@/lib/api';
import { formatSelectionLabel } from '@/lib/productVariants';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    _id: string;
    name: string;
    sku: string;
    category?: string;
  };
  selectedSize?: string;
  selectedColor?: string;
  moq?: number;
}

const inputClass =
  'w-full px-4 py-2.5 border border-border bg-cream text-sm focus:outline-none focus:border-primary';

export default function QuotationModal({
  isOpen,
  onClose,
  product,
  selectedSize = '',
  selectedColor = '',
  moq,
}: QuotationModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const selectionLabel = formatSelectionLabel(selectedSize, selectedColor);

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError('');
    }
  }, [isOpen, selectedSize, selectedColor]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const qty = parseInt(form.get('quantity') as string, 10);

    if (!qty || qty < 1) {
      setError('Please enter a valid quantity');
      setLoading(false);
      return;
    }

    const payload: Record<string, unknown> = {
      name: form.get('name') as string,
      company: form.get('company') as string,
      email: form.get('email') as string,
      phone: form.get('phone') as string,
      country: form.get('country') as string,
      city: form.get('city') as string,
      address: form.get('address') as string,
      notes: form.get('notes') as string,
      quantity: qty,
    };

    if (product) {
      payload.productId = product._id;
      payload.productName = product.name;
      payload.productSku = product.sku;
      payload.category = product.category || '';
      if (selectedSize) payload.selectedSize = selectedSize;
      if (selectedColor) payload.selectedColor = selectedColor;
    }

    try {
      await submitQuotation(payload);
      setSuccess(true);
      setToast('Quotation request submitted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-secondary/50" onClick={onClose} />
      <div className="relative bg-surface border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-secondary">Request Quotation</h2>
          <button onClick={onClose} className="p-2 hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <p className="font-display text-2xl text-secondary">Request Submitted</p>
            <p className="mt-2 text-muted text-sm">Our team will contact you within 24 hours with a quotation.</p>
            <Button className="mt-6" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {product && (
              <div className="bg-linen border border-border p-4 text-sm space-y-2">
                <p><span className="text-muted">Product:</span> {product.name}</p>
                <p><span className="text-muted">SKU:</span> {product.sku}</p>
                {selectionLabel && (
                  <p><span className="text-muted">Selection:</span> {selectionLabel}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1">Full Name *</label>
                <input name="name" required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1">Company</label>
                <input name="company" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1">Email *</label>
                <input name="email" type="email" required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1">Phone</label>
                <input name="phone" type="tel" className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1">Country</label>
                <input name="country" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-1">City</label>
                <input name="city" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-1">Address</label>
              <input name="address" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-1">Quantity *</label>
              <input name="quantity" type="number" min="1" required className={inputClass} />
              {moq ? (
                <p className="text-xs text-muted mt-1.5">Minimum order quantity for this product: {moq} pieces</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-1">Notes</label>
              <textarea name="notes" rows={3} className={`${inputClass} resize-none`} />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Submit Request
            </Button>
          </form>
        )}
      </div>
      <Toast message={toast} show={!!toast} onClose={() => setToast('')} />
    </div>
  );
}
