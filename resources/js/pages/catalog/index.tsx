import { Head } from '@inertiajs/react';
import { Search, SlidersHorizontal, Star, ShoppingCart, X, Loader2 } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PublicNav, PublicFooter } from '@/components/public-nav';

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
    filters: { categories: FilterCategory[]; brands: FilterBrand[]; price_range: { min: number; max: number }; sort_options: SortOption[]; applied: Record<string, string | boolean | null>; };
    meta: { current_page: number; last_page: number; total: number; per_page: number; from: number; to: number };
    links: { prev: string | null; next: string | null };
}

import { API } from '@/lib/api';

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

    // Read URL params on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('category')) setCategory(params.get('category')!);
        if (params.get('brand')) setBrand(params.get('brand')!);
        if (params.get('search')) setSearch(params.get('search')!);
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (brand) params.set('brand', brand);
        if (sort !== 'latest') params.set('sort', sort);
        params.set('page', page.toString());
        params.set('per_page', '15');
        const res = await fetch(`${API}/products?${params}`);
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
                <PublicNav />

                <div className="mx-auto max-w-7xl px-4 py-5">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight">
                                {category || brand ? `${category || brand}` : 'All Products'}
                            </h1>
                            {data?.meta && <p className="text-xs text-muted-foreground mt-0.5">{data.meta.total} products found</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    className="w-48 pl-9 h-9 text-xs rounded-full border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800" />
                            </div>
                            <Button variant="outline" size="sm" className="rounded-full gap-1.5 h-9 text-xs" onClick={() => setShowFilters(!showFilters)}>
                                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                            </Button>
                        </div>
                    </div>

                    {/* Mobile search */}
                    <div className="sm:hidden mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search furniture..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9 text-xs rounded-full" />
                        </div>
                    </div>

                    {/* Filter bar */}
                    {showFilters && data?.filters && (
                        <Card className="mb-5 border-0 shadow-sm">
                            <CardContent className="p-3">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <Select value={category} onValueChange={(v) => { setCategory(v === 'all' ? '' : v); setPage(1); }}>
                                        <SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue placeholder="All Categories" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {data.filters.categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name} ({c.products_count})</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Select value={brand} onValueChange={(v) => { setBrand(v === 'all' ? '' : v); setPage(1); }}>
                                        <SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue placeholder="All Brands" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Brands</SelectItem>
                                            {data.filters.brands.map((b) => <SelectItem key={b.slug} value={b.slug}>{b.name} ({b.products_count})</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
                                        <SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {data.filters.sort_options.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {hasFilters && <Button variant="ghost" size="sm" className="mt-2 text-[10px] gap-1 h-7" onClick={clearFilters}><X className="h-3 w-3" /> Clear all</Button>}
                            </CardContent>
                        </Card>
                    )}

                    {/* Active filters */}
                    {hasFilters && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {search && <Badge variant="secondary" className="gap-1 rounded-full px-2.5 text-[10px]">Search: {search} <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => setSearch('')} /></Badge>}
                            {category && <Badge variant="secondary" className="gap-1 rounded-full px-2.5 text-[10px]">{category} <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => setCategory('')} /></Badge>}
                            {brand && <Badge variant="secondary" className="gap-1 rounded-full px-2.5 text-[10px]">{brand} <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => setBrand('')} /></Badge>}
                        </div>
                    )}

                    {/* Product grid — compact 5 columns */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
                    ) : data?.products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <ShoppingCart className="h-14 w-14 mb-4 opacity-20" />
                            <p className="font-medium">No products found</p>
                            <p className="text-xs mt-1">Try adjusting your filters</p>
                            {hasFilters && <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={clearFilters}>Clear filters</Button>}
                        </div>
                    ) : (
                        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {data?.products.map((product) => (
                                <a key={product.id} href={`/catalog/${product.slug}`} className="group">
                                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-full">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="flex h-full items-center justify-center"><ShoppingCart className="h-8 w-8 text-zinc-300" /></div>
                                            )}
                                            <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
                                                {product.discount_percentage > 0 && <Badge className="bg-red-500 text-white text-[9px] px-1.5 py-0 border-0 shadow">-{product.discount_percentage}%</Badge>}
                                                {product.is_bestseller && <Badge className="bg-amber-500 text-white text-[9px] px-1.5 py-0 border-0 shadow">Best</Badge>}
                                            </div>
                                            {!product.availability.in_stock && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                    <Badge variant="destructive" className="text-[10px]">Sold Out</Badge>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-3">
                                            {product.brand && <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">{product.brand.name}</p>}
                                            <h3 className="font-bold text-xs leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                                            {product.reviews_count > 0 && (
                                                <div className="flex items-center gap-0.5 mt-1">
                                                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                                    <span className="text-[10px] font-bold">{product.reviews_avg_rating?.toFixed(1)}</span>
                                                    <span className="text-[9px] text-zinc-400">({product.reviews_count})</span>
                                                </div>
                                            )}
                                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                                <span className="text-sm font-extrabold">{formatIDR(product.effective_price)}</span>
                                                {product.discount_price && <span className="text-[10px] text-zinc-400 line-through">{formatIDR(product.price)}</span>}
                                            </div>
                                            {product.availability.status === 'low_stock' && (
                                                <p className="text-[9px] text-red-500 font-bold mt-0.5">{product.availability.label}</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {data?.meta && data.meta.last_page > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-8">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-full h-8 text-xs">Prev</Button>
                            {Array.from({ length: Math.min(data.meta.last_page, 7) }, (_, i) => {
                                let p: number;
                                if (data.meta.last_page <= 7) p = i + 1;
                                else if (page <= 4) p = i + 1;
                                else if (page >= data.meta.last_page - 3) p = data.meta.last_page - 6 + i;
                                else p = page - 3 + i;
                                return (
                                    <Button key={p} variant={p === page ? 'default' : 'ghost'} size="sm"
                                        className={`h-8 w-8 rounded-full p-0 text-xs ${p === page ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                                        onClick={() => setPage(p)}>{p}</Button>
                                );
                            })}
                            <Button variant="outline" size="sm" disabled={page >= data.meta.last_page} onClick={() => setPage(page + 1)} className="rounded-full h-8 text-xs">Next</Button>
                        </div>
                    )}
                </div>

                <PublicFooter />
            </div>
        </>
    );
}
