'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createProduct, updateProduct } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Product, Category } from '@/lib/types';
import { getCategoryOptions } from '@/lib/categories';
import Button from '@/components/ui/Button';

interface Props {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}

export default function ProductForm({ product, categories, onClose, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = getToken();
    if (!token) return;

    const form = new FormData(e.currentTarget);
    const sizes = (form.get('sizes') as string).split(',').map((s) => s.trim()).filter(Boolean);
    const colors = (form.get('colors') as string).split(',').map((s) => s.trim()).filter(Boolean);

    form.set('sizes', JSON.stringify(sizes));
    form.set('colors', JSON.stringify(colors));
    form.set('seo', JSON.stringify({
      metaTitle: form.get('metaTitle'),
      metaDescription: form.get('metaDescription'),
      keywords: form.get('keywords'),
    }));
    form.delete('metaTitle');
    form.delete('metaDescription');
    form.delete('keywords');

    const images = form.getAll('images');
    form.delete('images');
    images.forEach((img) => {
      if (img instanceof File && img.size > 0) form.append('images', img);
    });

    try {
      if (product) {
        await updateProduct(token, product._id, form);
      } else {
        await createProduct(token, form);
      }
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-secondary">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input name="name" required defaultValue={product?.name} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU *</label>
              <input name="sku" required defaultValue={product?.sku} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select name="category" required defaultValue={typeof product?.category === 'object' ? product.category._id : product?.category} className="w-full px-3 py-2 border rounded-xl text-sm">
                <option value="">Select category</option>
                {getCategoryOptions(categories).map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">MOQ</label>
              <input name="moq" type="number" min="1" defaultValue={product?.moq || 50} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" rows={3} defaultValue={product?.description} className="w-full px-3 py-2 border rounded-xl text-sm resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Specifications</label>
            <textarea name="specifications" rows={2} defaultValue={product?.specifications} className="w-full px-3 py-2 border rounded-xl text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
              <input name="sizes" defaultValue={product?.sizes?.join(', ')} placeholder="0-3M, 3-6M, 6-9M" className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Colors (comma separated)</label>
              <input name="colors" defaultValue={product?.colors?.join(', ')} placeholder="White, Pink, Blue" className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <input name="images" type="file" accept="image/*" multiple className="w-full text-sm" />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input name="isFeatured" type="checkbox" value="true" defaultChecked={product?.isFeatured} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input name="isActive" type="checkbox" value="true" defaultChecked={product?.isActive !== false} />
              Active
            </label>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">SEO</h3>
            <div className="space-y-3">
              <input name="metaTitle" placeholder="Meta Title" defaultValue={product?.seo?.metaTitle} className="w-full px-3 py-2 border rounded-xl text-sm" />
              <input name="metaDescription" placeholder="Meta Description" defaultValue={product?.seo?.metaDescription} className="w-full px-3 py-2 border rounded-xl text-sm" />
              <input name="keywords" placeholder="Keywords" defaultValue={product?.seo?.keywords} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading}>{product ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
