export interface SEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  seo: SEO;
  isActive: boolean;
  sortOrder: number;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  slug: string;
  category: Category | string;
  description: string;
  specifications: string;
  images: string[];
  sizes: string[];
  colors: string[];
  moq: number;
  isFeatured: boolean;
  isActive: boolean;
  seo: SEO;
  createdAt: string;
}

export interface QuotationVariant {
  size?: string;
  color?: string;
  label: string;
  quantity: number;
}

export interface Lead {
  _id: string;
  leadId: string;
  type: 'contact' | 'quotation';
  name: string;
  company: string;
  email: string;
  phone: string;
  message?: string;
  product?: Product;
  productName?: string;
  productSku?: string;
  category?: string;
  quantity?: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedSizes?: string[];
  selectedColors?: string[];
  variants?: QuotationVariant[];
  country?: string;
  city?: string;
  address?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'closed';
  createdAt: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Page {
  _id: string;
  slug: string;
  title: string;
  content: string;
  seo: SEO;
  isActive: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  message?: string;
}

export interface DashboardStats {
  stats: {
    totalProducts: number;
    totalCategories: number;
    totalLeads: number;
    newQuotations: number;
    contactRequests: number;
  };
  monthlyLeads: Array<{
    label: string;
    contact: number;
    quotation: number;
  }>;
  recentLeads: Lead[];
  recentQuotations: Lead[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}
