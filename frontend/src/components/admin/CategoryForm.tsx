'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createCategory, updateCategory } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Category } from '@/lib/types';
import { getParentCategoryOptions, getParentId } from '@/lib/categories';
import Button from '@/components/ui/Button';

interface Props {
  category: Category | null;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}

export default function CategoryForm({ category, categories, onClose, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const parentOptions = getParentCategoryOptions(categories, category?._id);
  const currentParentId = category ? getParentId(category) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = getToken();
    if (!token) return;

    const form = new FormData(e.currentTarget);
    form.set('seo', JSON.stringify({
      metaTitle: form.get('metaTitle'),
      metaDescription: form.get('metaDescription'),
      keywords: form.get('keywords'),
    }));
    form.delete('metaTitle');
    form.delete('metaDescription');
    form.delete('keywords');

    const parent = form.get('parent') as string;
    if (!parent) {
      form.set('parent', '');
    }

    try {
      if (category) {
        await updateCategory(token, category._id, form);
      } else {
        await createCategory(token, form);
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{category ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name *</label>
            <input name="name" required defaultValue={category?.name} className="w-full px-3 py-2 border rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parent Category</label>
            <select
              name="parent"
              defaultValue={currentParentId || ''}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            >
              <option value="">None (top-level category)</option>
              {parentOptions.map((parent) => (
                <option key={parent._id} value={parent._id}>{parent.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Leave empty for a main category (e.g. Baby Outfits). Select a parent for subcategories (e.g. Girls Outfits).
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" rows={2} defaultValue={category?.description} className="w-full px-3 py-2 border rounded-xl text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input name="image" type="file" accept="image/*" className="w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <input name="sortOrder" type="number" defaultValue={category?.sortOrder || 0} className="w-full px-3 py-2 border rounded-xl text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" value="true" defaultChecked={category?.isActive !== false} />
            Active
          </label>

          <div className="border-t pt-4 space-y-3">
            <h3 className="text-sm font-semibold">SEO</h3>
            <input name="metaTitle" placeholder="Meta Title" defaultValue={category?.seo?.metaTitle} className="w-full px-3 py-2 border rounded-xl text-sm" />
            <input name="metaDescription" placeholder="Meta Description" defaultValue={category?.seo?.metaDescription} className="w-full px-3 py-2 border rounded-xl text-sm" />
            <input name="keywords" placeholder="Keywords" defaultValue={category?.seo?.keywords} className="w-full px-3 py-2 border rounded-xl text-sm" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading}>{category ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
