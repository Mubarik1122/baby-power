'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { getBanners, deleteBanner, toggleBanner, getImageUrl } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Banner } from '@/lib/types';
import Button from '@/components/ui/Button';
import BannerForm from '@/components/admin/BannerForm';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBanners(false);
      setBanners(res.data);
    } catch {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    const token = getToken();
    if (!token) return;
    try {
      await deleteBanner(token, id);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleToggle = async (id: string) => {
    const token = getToken();
    if (!token) return;
    try {
      await toggleBanner(token, id);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Toggle failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary font-display">Banners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage homepage hero slides</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-4 h-4" /> Add Banner
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center text-gray-500">
          No banners yet. Add your first homepage slide.
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-48 h-32 sm:h-auto shrink-0 bg-muted">
                {b.image ? (
                  <Image src={getImageUrl(b.image)} alt={b.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-secondary">{b.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {b.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {b.subtitle && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{b.subtitle}</p>}
                  <p className="text-xs text-gray-400 mt-1">Order: {b.sortOrder} · CTA: {b.ctaText} → {b.ctaLink}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleToggle(b._id)} className="p-2 hover:bg-muted rounded-lg" title={b.isActive ? 'Deactivate' : 'Activate'}>
                    {b.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setEditing(b); setShowForm(true); }} className="p-2 hover:bg-muted rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(b._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BannerForm
          banner={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={() => { setShowForm(false); setEditing(null); fetchData(); }}
        />
      )}
    </div>
  );
}
