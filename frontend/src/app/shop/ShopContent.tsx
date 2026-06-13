'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProducts, getCategories } from '@/lib/api';
import { Product, Category, Pagination } from '@/lib/types';
import ProductCard from '@/components/ui/ProductCard';
import PageBanner from '@/components/ui/PageBanner';
import Button from '@/components/ui/Button';

export default function ShopContent({ categorySlug }: { categorySlug?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || searchParams.get('category') || '');

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '12' };
      if (selectedCategory) {
        const cat = categories.find((c) => c.slug === selectedCategory || c._id === selectedCategory);
        if (cat) params.category = cat._id;
      }
      if (search) params.search = search;
      if (sort) params.sort = sort;

      const res = await getProducts(params);
      setProducts(res.data);
      setPagination(res.pagination);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search, sort, categories]);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (categories.length > 0 || !selectedCategory) {
      fetchProducts(parseInt(searchParams.get('page') || '1'));
    }
  }, [fetchProducts, searchParams, categories, selectedCategory]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    router.push(slug ? `/shop/${slug}` : '/shop');
  };

  const categoryName = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.name
    : 'Catalog';

  return (
    <>
      <PageBanner
        title={categoryName || 'Catalog'}
        subtitle="Trade-only wholesale — request a quotation for pricing on all products"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-56 shrink-0">
            <div className="bg-surface border border-border p-5 sticky top-36">
              <h3 className="text-xs uppercase tracking-widest text-secondary mb-4">Filter</h3>

              <div className="mb-6">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                  placeholder="Search..."
                  className="w-full px-3 py-2.5 border border-border bg-cream text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-muted mb-2">Category</p>
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-2 py-2 text-sm transition-colors ${
                      !selectedCategory ? 'text-primary font-medium' : 'text-muted hover:text-secondary'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-2 py-2 text-sm transition-colors ${
                        selectedCategory === cat.slug ? 'text-primary font-medium' : 'text-muted hover:text-secondary'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-2">Sort</p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border bg-cream text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Newest</option>
                  <option value="name">Name A–Z</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-linen animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 border border-border bg-surface">
                <p className="text-muted">No products found</p>
                <Button className="mt-4" variant="outline" onClick={() => { setSearch(''); handleCategoryChange(''); }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12">
                  {products.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </div>

                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-14">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => fetchProducts(page)}
                        className={`w-9 h-9 text-sm transition-colors ${
                          page === pagination.page
                            ? 'bg-secondary text-white'
                            : 'border border-border text-muted hover:border-secondary hover:text-secondary'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
