'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { getProducts, deleteProduct, toggleProduct, getCategories } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Product, Category } from '@/lib/types';
import Button from '@/components/ui/Button';
import ProductForm from '@/components/admin/ProductForm';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        getProducts({ active: 'false', limit: '100' }),
        getCategories(false),
      ]);
      setProducts(p.data);
      setCategories(c.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const token = getToken();
    if (!token) return;
    try {
      await deleteProduct(token, id);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleToggle = async (id: string) => {
    const token = getToken();
    if (!token) return;
    try {
      await toggleProduct(token, id);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-secondary font-display">Products</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-secondary">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary">SKU</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary">MOQ</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {typeof p.category === 'object' ? p.category.name : '-'}
                    </td>
                    <td className="px-4 py-3">{p.moq}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleToggle(p._id)} className="p-2 hover:bg-muted rounded-lg" title="Toggle">
                          {p.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 hover:bg-muted rounded-lg" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={() => { setShowForm(false); setEditing(null); fetchData(); }}
        />
      )}
    </div>
  );
}
