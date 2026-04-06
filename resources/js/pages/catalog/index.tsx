import { Head } from '@inertiajs/react';
import { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, SlidersHorizontal, Star, ShoppingCart, X, Loader2 } from 'lucide-react';

interface FilterCategory { id: number; name: string; name_id: string; slug: string; products_count: number; }
interface FilterBrand { id: number; name: string; slug: string; products_count: number; }
interface SortOption { value: string; label: string; }
interface ProductItem {
  id: number; name: string; slug: string; price: number; discount_price: number | null;
  effective_price: number; discount_percentage: number; image_url: string | null;
  availability: { in_stock: boolean; status: string; label: string };
  is_bestseller: boolean; is_featured: boolean; material: string | null;
  category: { name: string; slug: string } | null;
  brand: { name: string; slug: string; logo: string | null } | null;
  reviews_count: number; reviews_avg_rating: number | null;
}
interface ApiResponse {
  products: ProductItem[];
  filters: {
    categories: FilterCategory[]; brands: FilterBrand[];
    price_range: { min: number; max: number };
    sort_options: SortOption[];
    applied: Record<string, string | boolean | null>;
  };
  meta: { current_page: number; last_page: number; total: number; per_page: number; from: number; to: number };
  links: { prev: string | null; next: string | null };
}

const formatIDR = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

export default function CatalogIndex() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (brand) params.set('brand', brand);
    if (sort !== 'latest') params.set('sort', sort);
    params.set('page', page.toString());
    params.set('per_page', '12');

    const res = await fetch(`/api/products?${params}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [search, category, brand, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const clearFilters = () => { setSearch(''); setCategory(''); setBrand(''); setSort('latest'); setPage(1); };
  const hasFilters = search || category || brand || sort !== 'latest';

  return (
    <>
      <Head title="Shop — IKEO" />
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a]">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg dark:bg-[#0a0a0a]/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-xs">IK</div>
              <span className="text-lg font-bold">IKEO</span>
            </a>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search furniture..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-64 pl-9 rounded-full border-muted bg-muted/30"
                />
              </div>
              <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Mobile search */}
          <div className="sm:hidden mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search furniture..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 rounded-full" />
            </div>
          </div>

          {/* Filter bar */}
          {showFilters && data?.filters && (
            <Card className="mb-6 border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
                    <Select value={category} onValueChange={(v) => { setCategory(v === 'all' ? '' : v); setPage(1); }}>
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder="All Categories" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {data.filters.categories.map((c) => (
                          <SelectItem key={c.slug} value={c.slug}>{c.name} ({c.products_count})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Brand</label>
                    <Select value={brand} onValueChange={(v) => { setBrand(v === 'all' ? '' : v); setPage(1); }}>
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder="All Brands" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {data.filters.brands.map((b) => (
                          <SelectItem key={b.slug} value={b.slug}>{b.name} ({b.products_count})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Sort By</label>
                    <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
                      <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {data.filters.sort_options.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {hasFilters && (
                  <Button variant="ghost" size="sm" className="mt-3 text-xs gap-1" onClick={clearFilters}>
                    <X className="h-3 w-3" /> Clear all filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Active filters */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {search && <Badge variant="secondary" className="gap-1 rounded-full px-3">Search: {search} <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch('')} /></Badge>}
              {category && <Badge variant="secondary" className="gap-1 rounded-full px-3">{category} <X className="h-3 w-3 cursor-pointer" onClick={() => setCategory('')} /></Badge>}
              {brand && <Badge variant="secondary" className="gap-1 rounded-full px-3">{brand} <X className="h-3 w-3 cursor-pointer" onClick={() => setBrand('')} /></Badge>}
            </div>
          )}

          {/* Results count */}
          {data?.meta && (
            <p className="text-sm text-muted-foreground mb-4">
              Showing {data.meta.from ?? 0}–{data.meta.to ?? 0} of {data.meta.total} products
            </p>
          )}

          {/* Product grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : data?.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your filters or search term</p>
              {hasFilters && <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>Clear filters</Button>}
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data?.products.map((product) => (
                <a key={product.id} href={`/catalog/${product.slug}`} className="group">
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden bg-muted/30">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingCart className="h-12 w-12 text-muted-foreground/20" />
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.discount_percentage > 0 && (
                          <Badge className="bg-red-500 text-white text-[10px] px-2 border-0 shadow">-{product.discount_percentage}%</Badge>
                        )}
                        {product.is_bestseller && (
                          <Badge className="bg-amber-500 text-white text-[10px] px-2 border-0 shadow">Bestseller</Badge>
                        )}
                        {product.is_featured && (
                          <Badge className="bg-blue-500 text-white text-[10px] px-2 border-0 shadow">Featured</Badge>
                        )}
                      </div>
                      {!product.availability.in_stock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      {product.brand && (
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">{product.brand.name}</p>
                      )}
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                      {product.reviews_count > 0 && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">{product.reviews_avg_rating?.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
                        </div>
                      )}
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-base font-bold">{formatIDR(product.effective_price)}</span>
                        {product.discount_price && (
                          <span className="text-xs text-muted-foreground line-through">{formatIDR(product.price)}</span>
                        )}
                      </div>
                      {product.availability.status === 'low_stock' && (
                        <p className="text-[10px] text-red-500 font-medium mt-1">{product.availability.label}</p>
                      )}
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data?.meta && data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-full">
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(data.meta.last_page, 7) }, (_, i) => {
                  let p: number;
                  if (data.meta.last_page <= 7) { p = i + 1; }
                  else if (page <= 4) { p = i + 1; }
                  else if (page >= data.meta.last_page - 3) { p = data.meta.last_page - 6 + i; }
                  else { p = page - 3 + i; }
                  return (
                    <Button key={p} variant={p === page ? 'default' : 'ghost'} size="sm"
                      className={`h-8 w-8 rounded-full p-0 ${p === page ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                      onClick={() => setPage(p)}>
                      {p}
                    </Button>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" disabled={page >= data.meta.last_page} onClick={() => setPage(page + 1)} className="rounded-full">
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t mt-12">
          <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} IKEO. Scandinavian Furniture.
          </div>
        </footer>
      </div>
    </>
  );
}
