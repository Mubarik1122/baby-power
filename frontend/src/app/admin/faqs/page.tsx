'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { FAQ } from '@/lib/types';
import Button from '@/components/ui/Button';

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState({ question: '', answer: '', sortOrder: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getFAQs();
      setFaqs(res.data);
    } catch {
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    const token = getToken();
    if (!token) return;
    if (editing) {
      await updateFAQ(token, editing._id, form);
    } else {
      await createFAQ(token, form);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ question: '', answer: '', sortOrder: 0 });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    const token = getToken();
    if (!token) return;
    await deleteFAQ(token, id);
    fetchData();
  };

  const openEdit = (faq: FAQ) => {
    setEditing(faq);
    setForm({ question: faq.question, answer: faq.answer, sortOrder: faq.sortOrder });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-secondary font-display">FAQs</h1>
        <Button onClick={() => { setEditing(null); setForm({ question: '', answer: '', sortOrder: 0 }); setShowForm(true); }}>
          <Plus className="w-4 h-4" /> Add FAQ
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-white rounded-2xl border border-border p-5 shadow-sm flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-secondary">{faq.question}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex gap-1 ml-4">
                <button onClick={() => openEdit(faq)} className="p-2 hover:bg-muted rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(faq._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-lg font-bold">{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question" className="w-full px-3 py-2 border rounded-xl text-sm" />
            <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Answer" rows={4} className="w-full px-3 py-2 border rounded-xl text-sm resize-none" />
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) })} placeholder="Sort Order" className="w-full px-3 py-2 border rounded-xl text-sm" />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
