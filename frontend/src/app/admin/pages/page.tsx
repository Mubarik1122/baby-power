'use client';

import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { getPages, updatePage } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Page } from '@/lib/types';
import Button from '@/components/ui/Button';

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState({ title: '', content: '', metaTitle: '', metaDescription: '', keywords: '' });

  const fetchData = async () => {
    setLoading(true);
    const token = getToken();
    if (!token) return;
    try {
      const res = await getPages(token);
      setPages(res.data);
    } catch {
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openEdit = (page: Page) => {
    setEditing(page);
    setForm({
      title: page.title,
      content: page.content,
      metaTitle: page.seo?.metaTitle || '',
      metaDescription: page.seo?.metaDescription || '',
      keywords: page.seo?.keywords || '',
    });
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token || !editing) return;
    await updatePage(token, editing._id, {
      title: form.title,
      content: form.content,
      seo: { metaTitle: form.metaTitle, metaDescription: form.metaDescription, keywords: form.keywords },
    });
    setEditing(null);
    fetchData();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-8 font-display">Pages</h1>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page._id} className="bg-white rounded-2xl border border-border p-5 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-medium text-secondary">{page.title}</h3>
                <p className="text-sm text-gray-500">/{page.slug}</p>
              </div>
              <button onClick={() => openEdit(page)} className="p-2 hover:bg-muted rounded-lg">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-lg font-bold">Edit: {editing.title}</h2>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full px-3 py-2 border rounded-xl text-sm" />
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Content (HTML supported)" rows={10} className="w-full px-3 py-2 border rounded-xl text-sm resize-none font-mono" />
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-semibold">SEO</h3>
              <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="Meta Title" className="w-full px-3 py-2 border rounded-xl text-sm" />
              <input value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="Meta Description" className="w-full px-3 py-2 border rounded-xl text-sm" />
              <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="Keywords" className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
