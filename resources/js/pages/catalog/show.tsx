import { Head } from '@inertiajs/react';
import { Star, ArrowLeft, Loader2, ShoppingCart, Truck, ShieldCheck, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProductDetail {
  id: number; name: string; slug: string; description: string; description_id: string;
  price: number; discount_price: number | null; effective_price: number; discount_percentage: number;
  image_url: string | null; stock: number; material: string; dimensions: string; weight: number;
  availability: { in_stock: boolean; status: string; label: string };
  is_bestseller: boolean; is_featured: boolean;
  category: { name: string; slug: string } | null;
  brand: { name: string; slug: string; logo: string | null } | null;
  variants: { id: number; variant_name: string; color: string; size: string; sku: string; price: number; stock: number; is_active: boolean }[];
  images: { id: number; url: string; sort_order: number }[];
  reviews_count: number; reviews_avg_rating: number | null;
}

interface ReviewItem { id: number; rating: number; comment: string; created_at: string; user: { name: string } }

const formatIDR = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${cls} ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />
      ))}
    </div>
  );
}

export default function CatalogShow() {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  useEffect(() => {
    if (!slug) {
return;
}

    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((json) => {
        setProduct(json.data);
        setRelated(json.related || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Package className="h-16 w-16 text-muted-foreground/20" />
        <p className="text-lg font-medium">Product not found</p>
        <a href="/catalog"><Button variant="outline">Back to Shop</Button></a>
      </div>
    );
  }

  const activeVariant = product.variants?.find((v) => v.id === selectedVariant);
  const displayPrice = activeVariant ? activeVariant.price : product.effective_price;
  const allImages = [
    ...(product.image_url ? [{ id: 0, url: product.image_url, sort_order: 0 }] : []),
    ...(product.images || []),
  ];

  return (
    <>
      <Head title={`${product.name} — IKEO`} />
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a]">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-lg dark:bg-[#0a0a0a]/80">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
            <a href="/catalog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Shop
            </a>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/30 shadow-sm">
                {allImages.length > 0 ? (
                  <img src={allImages[selectedImage]?.url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center"><Package className="h-20 w-20 text-muted-foreground/20" /></div>
                )}
                {product.discount_percentage > 0 && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0 shadow-lg text-sm px-3 py-1">-{product.discount_percentage}%</Badge>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <button key={img.id} onClick={() => setSelectedImage(i)}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${i === selectedImage ? 'border-amber-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-6">
              <div>
                {product.brand && <p className="text-xs font-medium uppercase tracking-widest text-amber-600 mb-2">{product.brand.name}</p>}
                <h1 className="text-3xl font-extrabold tracking-tight">{product.name}</h1>
                {product.category && <p className="text-sm text-muted-foreground mt-1">in {product.category.name}</p>}
              </div>

              {/* Rating */}
              {product.reviews_count > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={product.reviews_avg_rating ?? 0} size="md" />
                  <span className="font-semibold">{product.reviews_avg_rating?.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews_count} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold">{formatIDR(displayPrice)}</span>
                {product.discount_price && !activeVariant && (
                  <span className="text-lg text-muted-foreground line-through">{formatIDR(product.price)}</span>
                )}
              </div>

              {/* Availability */}
              <Badge className={`text-xs px-3 py-1 border-0 ${
                product.availability.status === 'in_stock' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                product.availability.status === 'low_stock' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {product.availability.label}
              </Badge>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Variants</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button key={v.id} onClick={() => setSelectedVariant(selectedVariant === v.id ? null : v.id)}
                        className={`rounded-xl border px-4 py-2 text-sm transition-all ${selectedVariant === v.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 font-semibold' : 'hover:border-muted-foreground/50'}`}>
                        {v.variant_name}
                        <span className="block text-xs text-muted-foreground">{formatIDR(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3">
                {product.material && <div className="rounded-xl bg-muted/30 p-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Material</p><p className="text-sm font-medium">{product.material}</p></div>}
                {product.dimensions && <div className="rounded-xl bg-muted/30 p-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Dimensions</p><p className="text-sm font-medium">{product.dimensions}</p></div>}
                {product.weight && <div className="rounded-xl bg-muted/30 p-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Weight</p><p className="text-sm font-medium">{product.weight} kg</p></div>}
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 border-t pt-5">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Truck className="h-5 w-5 text-amber-500" />
                  <span className="text-[10px] text-muted-foreground">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                  <span className="text-[10px] text-muted-foreground">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span className="text-[10px] text-muted-foreground">Premium Quality</span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t pt-5">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">You might also like</h2>
              <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
                {related.map((p: any) => (
                  <a key={p.id} href={`/catalog/${p.slug}`} className="group">
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-square overflow-hidden bg-muted/30">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="flex h-full items-center justify-center"><ShoppingCart className="h-8 w-8 text-muted-foreground/20" /></div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p className="font-semibold text-sm truncate">{p.name}</p>
                        <p className="text-sm font-bold mt-1">{formatIDR(p.effective_price)}</p>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
