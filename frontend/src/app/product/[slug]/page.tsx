import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateSEO, ProductSchema } from '@/components/seo/SEOHead';
import { getProductBySlug, getProducts, getCategories } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import ProductDetail from './ProductDetail';
import CategoryScrollStrip from '@/components/home/CategoryScrollStrip';
import RecentProductsSlider from '@/components/ui/RecentProductsSlider';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await getProductBySlug(slug);
    return generateSEO({
      title: data.seo?.metaTitle || data.name,
      description: data.seo?.metaDescription || data.description,
      keywords: data.seo?.keywords,
      path: `/product/${slug}`,
      type: 'website',
    });
  } catch {
    return generateSEO({ title: 'Product', description: 'Product details', path: `/product/${slug}` });
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product: Product;
  let recentProducts: Product[] = [];
  let categories: Category[] = [];

  try {
    const res = await getProductBySlug(slug);
    product = res.data;

    const [allRes, catRes] = await Promise.all([
      getProducts({ limit: '12' }),
      getCategories(),
    ]);

    recentProducts = (allRes.data || []).filter((p) => p._id !== product._id).slice(0, 10);
    categories = catRes.data || [];
  } catch {
    notFound();
  }

  return (
    <>
      <ProductSchema product={product} />
      <ProductDetail product={product} />
      <CategoryScrollStrip categories={categories} title="More Categories" />
      <RecentProductsSlider products={recentProducts} title="Recent Products" />
    </>
  );
}
