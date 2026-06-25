'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getCategories, deleteCategory } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Category } from '@/lib/types';
import Button from '@/components/ui/Button';
import CategoryForm from '@/components/admin/CategoryForm';
import { getChildCategories, getParentId, getRootCategories } from '@/lib/categories';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCategories(false);
      setCategories(res.data);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    const token = getToken();
    if (!token) return;
    try {
      await deleteCategory(token, id);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-secondary font-display">Categories</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Parent</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getRootCategories(categories).map((parent) => {
                const children = getChildCategories(categories, parent._id);
                const rows = [parent, ...children];

                return rows.map((category, index) => {
                  const parentName = getParentId(category)
                    ? categories.find((item) => item._id === getParentId(category))?.name
                    : '—';

                  return (
                    <tr key={category._id} className="border-t border-border hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">
                        <span className={index > 0 ? 'pl-6 text-gray-700' : ''}>
                          {index > 0 ? `— ${category.name}` : category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{parentName}</td>
                      <td className="px-4 py-3 text-gray-500">{category.slug}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditing(category); setShowForm(true); }} className="p-2 hover:bg-muted rounded-lg">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(category._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <CategoryForm
          category={editing}
          categories={categories}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={() => { setShowForm(false); setEditing(null); fetchData(); }}
        />
      )}
    </div>
  );
}
