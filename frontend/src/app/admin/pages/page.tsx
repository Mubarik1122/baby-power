'use client';

import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { getPages, updatePage } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Page } from '@/lib/types';
import Button from '@/components/ui/Button';

type AboutExtras = {
  storyImage?: string;
  sectionLabel?: string;
  sectionHeading?: string;
  cards?: Array<{ title: string; desc: string }>;
};

type ContactExtras = {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
};

type HomeStoryExtras = {
  label?: string;
};

function getPageType(slug: string) {
  if (slug === 'about') return 'about';
  if (slug === 'contact') return 'contact';
  if (slug === 'home-story') return 'home-story';
  return 'policy';
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    storyImage: '',
    sectionLabel: '',
    sectionHeading: '',
    cardsJson: '',
    address: '',
    phone: '',
    email: '',
    hours: '',
    storyLabel: '',
  });

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
    const extras = (page.extras || {}) as AboutExtras & ContactExtras & HomeStoryExtras;
    setEditing(page);
    setForm({
      title: page.title,
      subtitle: page.subtitle || '',
      content: page.content,
      metaTitle: page.seo?.metaTitle || '',
      metaDescription: page.seo?.metaDescription || '',
      keywords: page.seo?.keywords || '',
      storyImage: extras.storyImage || '',
      sectionLabel: extras.sectionLabel || '',
      sectionHeading: extras.sectionHeading || '',
      cardsJson: JSON.stringify(extras.cards || [], null, 2),
      address: extras.address || '',
      phone: extras.phone || '',
      email: extras.email || '',
      hours: extras.hours || '',
      storyLabel: extras.label || '',
    });
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token || !editing) return;

    let extras: Record<string, unknown> | undefined;
    const pageType = getPageType(editing.slug);

    if (pageType === 'about') {
      try {
        extras = {
          storyImage: form.storyImage,
          sectionLabel: form.sectionLabel,
          sectionHeading: form.sectionHeading,
          cards: JSON.parse(form.cardsJson || '[]'),
        };
      } catch {
        alert('Invalid cards JSON. Please check the format.');
        return;
      }
    } else if (pageType === 'contact') {
      extras = {
        address: form.address,
        phone: form.phone,
        email: form.email,
        hours: form.hours,
      };
    } else if (pageType === 'home-story') {
      extras = { label: form.storyLabel };
    }

    await updatePage(token, editing._id, {
      title: form.title,
      subtitle: form.subtitle,
      content: form.content,
      seo: { metaTitle: form.metaTitle, metaDescription: form.metaDescription, keywords: form.keywords },
      ...(extras ? { extras } : {}),
    });
    setEditing(null);
    fetchData();
  };

  const pageType = editing ? getPageType(editing.slug) : 'policy';

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-2 font-display">Pages</h1>
      <p className="text-sm text-gray-500 mb-8">
        Edit policy pages, About Us, Contact Us, and the Home page Our Story section.
      </p>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
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

            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />

            {(pageType === 'about' || pageType === 'contact') && (
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Banner subtitle"
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            )}

            {pageType === 'home-story' && (
              <input
                value={form.storyLabel}
                onChange={(e) => setForm({ ...form, storyLabel: e.target.value })}
                placeholder="Section label (e.g. Our Story)"
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            )}

            {pageType === 'about' && (
              <>
                <input
                  value={form.storyImage}
                  onChange={(e) => setForm({ ...form, storyImage: e.target.value })}
                  placeholder="Story image URL"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
                <input
                  value={form.sectionLabel}
                  onChange={(e) => setForm({ ...form, sectionLabel: e.target.value })}
                  placeholder="Section label (e.g. Who We Are)"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
                <input
                  value={form.sectionHeading}
                  onChange={(e) => setForm({ ...form, sectionHeading: e.target.value })}
                  placeholder="Section heading"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </>
            )}

            {pageType === 'contact' && (
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className="w-full px-3 py-2 border rounded-xl text-sm sm:col-span-2" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full px-3 py-2 border rounded-xl text-sm" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2 border rounded-xl text-sm" />
                <input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} placeholder="Business hours" className="w-full px-3 py-2 border rounded-xl text-sm sm:col-span-2" />
              </div>
            )}

            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder={pageType === 'home-story' ? 'Story paragraph' : 'Content (HTML supported)'}
              rows={pageType === 'home-story' ? 5 : 10}
              className="w-full px-3 py-2 border rounded-xl text-sm resize-none font-mono"
            />

            {pageType === 'about' && (
              <textarea
                value={form.cardsJson}
                onChange={(e) => setForm({ ...form, cardsJson: e.target.value })}
                placeholder='Mission/Vision cards JSON: [{"title":"...","desc":"..."}]'
                rows={8}
                className="w-full px-3 py-2 border rounded-xl text-sm resize-none font-mono"
              />
            )}

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
