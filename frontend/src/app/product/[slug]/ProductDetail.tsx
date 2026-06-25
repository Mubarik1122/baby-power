'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, ShieldCheck, Truck, Star } from 'lucide-react';
import ApiImage from '@/components/ui/ApiImage';
import { Product } from '@/lib/types';
import { isAttributeSelectionValid, productHasAttributes, formatSelectionLabel } from '@/lib/productVariants';
import Button from '@/components/ui/Button';
import QuotationModal from '@/components/forms/QuotationModal';
import { cn } from '@/lib/utils';

function OptionChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 border text-sm transition-all duration-200',
        selected
          ? 'border-primary bg-primary/10 text-secondary ring-1 ring-primary/30'
          : 'border-border text-secondary bg-surface hover:border-primary/50'
      )}
    >
      {label}
    </button>
  );
}

interface Props {
  product: Product;
}

export default function ProductDetail({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectionError, setSelectionError] = useState('');

  const category = typeof product.category === 'object' ? product.category : null;
  const images = product.images?.length ? product.images : [];
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const hasAttributes = productHasAttributes(sizes, colors);
  const selectionValid = isAttributeSelectionValid(sizes, colors, selectedSize, selectedColor);
  const selectionLabel = formatSelectionLabel(selectedSize, selectedColor);

  const handleRequestQuote = () => {
    if (hasAttributes && !selectionValid) {
      setSelectionError('Please select your options before requesting a quotation.');
      return;
    }
    setSelectionError('');
    setShowQuote(true);
  };

  const highlights = [
    { icon: ShieldCheck, text: 'OEKO-TEX certified materials' },
    { icon: Truck, text: 'UK & NI wholesale delivery' },
    { icon: Star, text: 'Trade-only pricing on request' },
  ];

  return (
    <>
      <div className="bg-linen border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-muted flex-wrap">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-primary">Catalog</Link>
            {category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/shop/${category.slug}`} className="hover:text-primary">{category.name}</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Image gallery — larger, busier */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] bg-linen overflow-hidden border border-border">
              {images.length > 0 ? (
                <ApiImage
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blush to-linen">
                  <Package className="w-20 h-20 text-primary/30" />
                </div>
              )}
              {product.isFeatured && (
                <span className="absolute top-4 left-4 bg-primary text-white text-[10px] uppercase tracking-widest px-3 py-1.5">
                  Featured
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <ApiImage src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            {category && (
              <Link href={`/shop/${category.slug}`} className="text-xs uppercase tracking-widest text-primary hover:underline">
                {category.name}
              </Link>
            )}
            <h1 className="font-display text-3xl lg:text-4xl text-secondary mt-2 tracking-wide leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-muted mt-2">SKU: {product.sku}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              {highlights.map((h) => (
                <span key={h.text} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted bg-linen px-3 py-1.5 border border-border">
                  <h.icon className="w-3.5 h-3.5 text-primary" />
                  {h.text}
                </span>
              ))}
            </div>

            <div className="mt-6 py-4 border-y border-border bg-cream/50 px-4">
              <p className="text-xs uppercase tracking-widest text-muted">Minimum Order Quantity</p>
              <p className="font-display text-2xl text-primary mt-1">{product.moq} pieces</p>
              <p className="text-xs text-muted mt-2 italic">Request a quotation for trade pricing</p>
            </div>

            {sizes.length > 0 && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-muted mb-3">
                  Available Sizes <span className="text-primary">*</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <OptionChip
                      key={size}
                      label={size}
                      selected={selectedSize === size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSelectionError('');
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-muted mb-3">
                  Available Colours <span className="text-primary">*</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <OptionChip
                      key={color}
                      label={color}
                      selected={selectedColor === color}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectionError('');
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectionLabel && (
              <div className="mt-4 px-4 py-3 bg-sage-light/60 border border-primary/25 text-sm">
                <span className="text-muted">Your selection: </span>
                <span className="text-secondary font-medium">{selectionLabel}</span>
              </div>
            )}

            {selectionError && (
              <p className="mt-4 text-sm text-red-600">{selectionError}</p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={handleRequestQuote}>
                Request Quotation
              </Button>
              {category && (
                <Link href={`/shop/${category.slug}`}>
                  <Button variant="outline" size="lg">More in {category.name}</Button>
                </Link>
              )}
            </div>

            {product.description && (
              <div className="mt-8 pt-6 border-t border-border">
                <h2 className="font-display text-lg text-secondary mb-2">Description</h2>
                <p className="text-muted text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.specifications && (
              <div className="mt-6 p-4 bg-linen border border-border">
                <h2 className="font-display text-lg text-secondary mb-2">Specifications</h2>
                <p className="text-muted text-sm leading-relaxed">{product.specifications}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuotationModal
        isOpen={showQuote}
        onClose={() => setShowQuote(false)}
        product={{
          _id: product._id,
          name: product.name,
          sku: product.sku,
          category: category?.name,
        }}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        moq={product.moq}
      />
    </>
  );
}
