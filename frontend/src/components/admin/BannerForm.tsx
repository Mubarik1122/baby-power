'use client';

import { useState } from 'react';
import ApiImage from '@/components/ui/ApiImage';
import { X } from 'lucide-react';
import { createBanner, updateBanner } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Banner } from '@/lib/types';
import Button from '@/components/ui/Button';

interface Props {
  banner: Banner | null;
  onClose: () => void;
  onSave: () => void;
}

export default function BannerForm({ banner, onClose, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = getToken();
    if (!token) return;

    const form = new FormData(e.currentTarget);
    const imageFile = form.get('image') as File;
    if (imageFile?.size) {
      form.set('image', imageFile);
    } else {
      form.delete('image');
    }

    const imageUrl = (form.get('imageUrl') as string)?.trim();
    if (imageUrl) form.set('imageUrl', imageUrl);
    else form.delete('imageUrl');

    if (!banner && !imageFile?.size && !imageUrl) {
      setError('Please upload an image or provide an image URL');
      setLoading(false);
      return;
    }

    try {
      const res = banner
        ? await updateBanner(token, banner._id, form)
        : await createBanner(token, form);

      if (!res.success) throw new Error(res.message || 'Save failed');
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{banner ? 'Edit Banner' : 'Add Banner'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input name="title" required defaultValue={banner?.title} className="w-full px-3 py-2 border rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <textarea name="subtitle" rows={2} defaultValue={banner?.subtitle} className="w-full px-3 py-2 border rounded-xl text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">CTA Text</label>
              <input name="ctaText" defaultValue={banner?.ctaText || 'Shop Now'} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA Link</label>
              <input name="ctaLink" defaultValue={banner?.ctaLink || '/shop'} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
          </div>

          {banner?.image && (
            <div className="relative aspect-[16/6] rounded-xl overflow-hidden border">
              <ApiImage src={banner.image} alt={banner.title} fill className="object-cover" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Upload Image{banner ? '' : ' *'}</label>
            <input name="image" type="file" accept="image/*" className="w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Or Image URL</label>
            <input
              name="imageUrl"
              type="url"
              placeholder="https://..."
              defaultValue={banner?.image?.startsWith('http') ? banner.image : ''}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <input name="sortOrder" type="number" defaultValue={banner?.sortOrder ?? 0} className="w-full px-3 py-2 border rounded-xl text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" value="true" defaultChecked={banner?.isActive !== false} />
            Active
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading}>{banner ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
