import { Head } from '@inertiajs/react';
import { Armchair, ShieldCheck, Truck, Headphones, Star, ArrowRight, ShoppingCart, BookOpen, Loader2, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PublicNav, PublicFooter } from '@/components/public-nav';

interface CategoryItem { id: number; name: string; name_id: string; slug: string; image: string | null; products_count: number; }
interface BrandItem { id: number; name: string; slug: string; logo: string | null; description: string | null; products_count: number; }
interface ProductItem {
    id: number; name: string; slug: string; price: number; effective_price: number;
    discount_percentage: number; image_url: string | null; is_bestseller: boolean;
    brand: { name: string } | null; reviews_count: number; reviews_avg_rating: number | null;
}
interface BlogItem { id: number; title: string; slug: string; excerpt: string; category: string; image: string | null; published_at: string; }

const formatIDR = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

export default function Welcome() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [brands, setBrands] = useState<BrandItem[]>([]);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/categories').then((r) => r.json()),
            fetch('/api/brands').then((r) => r.json()),
            fetch('/api/products?per_page=8&sort=latest').then((r) => r.json()),
            fetch('/api/blogs?per_page=3').then((r) => r.json()),
        ]).then(([catJson, brandJson, prodJson, blogJson]) => {
            setCategories(catJson.data || []);
            setBrands(brandJson.data || []);
            setProducts(prodJson.data?.products || []);
            setBlogs(blogJson.data || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <>
            <Head title="IKEO — Scandinavian Furniture" />
            <div className="min-h-screen bg-[#FAFAF8] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <PublicNav />

                <main>
                    {/* ── Hero ── */}
                    <section className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/30 to-transparent dark:from-amber-950/20 dark:via-transparent" />
                        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28 text-center">
                            <Badge className="mb-4 bg-amber-100 text-amber-700 border-0 px-4 py-1 text-xs font-bold dark:bg-amber-900/30 dark:text-amber-400">Scandinavian Design</Badge>
                            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
                                Furniture that feels<br /><span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">like home</span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400">
                                Discover minimalist Scandinavian furniture crafted with natural materials. Simple, functional, and beautifully designed for modern living.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-4">
                                <a href="/catalog" className="rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-zinc-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all dark:from-white dark:to-zinc-100 dark:text-black">
                                    Shop Now
                                </a>
                                <a href="/consultation" className="rounded-2xl border-2 border-zinc-200 px-8 py-4 text-sm font-bold hover:border-amber-400 hover:bg-amber-50 transition-all dark:border-zinc-700 dark:hover:border-amber-500 dark:hover:bg-amber-950/20">
                                    Book Consultation
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* ── Features ── */}
                    <section className="mx-auto max-w-6xl px-6 py-12">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { icon: Armchair, title: 'Premium Quality', desc: 'Solid oak, birch & sustainable materials', color: 'from-amber-500 to-orange-500' },
                                { icon: Truck, title: 'Fast Delivery', desc: 'JNE, GoSend, SiCepat nationwide', color: 'from-blue-500 to-cyan-500' },
                                { icon: ShieldCheck, title: 'Secure Payment', desc: 'Xendit payment gateway integration', color: 'from-emerald-500 to-teal-500' },
                                { icon: Headphones, title: 'Free Consultation', desc: 'Interior experts at 8 showrooms', color: 'from-purple-500 to-indigo-500' },
                            ].map((f, i) => (
                                <div key={i} className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all dark:border-zinc-800 dark:bg-zinc-900/50">
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-md`}>
                                        <f.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{f.title}</h3>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Shop by Category ── */}
                    <section className="mx-auto max-w-6xl px-6 py-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Browse</p>
                                <h2 className="text-3xl font-extrabold tracking-tight">Shop by Category</h2>
                            </div>
                            <a href="/catalog" className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:gap-3 transition-all">View All <ArrowRight className="h-4 w-4" /></a>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
                        ) : (
                            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                                {categories.map((cat) => (
                                    <a key={cat.id} href={`/catalog?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        {cat.image ? (
                                            <img src={cat.image.startsWith('http') ? cat.image : `/storage/${cat.image}`} alt={cat.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="font-bold text-white text-lg">{cat.name}</h3>
                                            <p className="text-xs text-white/70">{cat.products_count} products</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── Our Brands ── */}
                    <section className="bg-white dark:bg-zinc-900/30 border-y border-zinc-100 dark:border-zinc-800">
                        <div className="mx-auto max-w-6xl px-6 py-16">
                            <div className="text-center mb-10">
                                <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Trusted Partners</p>
                                <h2 className="text-3xl font-extrabold tracking-tight">Our Brands</h2>
                            </div>
                            {loading ? (
                                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    {brands.map((brand) => (
                                        <a key={brand.id} href={`/catalog?brand=${brand.slug}`} className="group">
                                            <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center h-full">
                                                <CardContent className="p-6 flex flex-col items-center gap-3">
                                                    <div className="h-20 w-20 rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-3 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                                        {brand.logo ? (
                                                            <img src={brand.logo.startsWith('http') ? brand.logo : `/storage/${brand.logo}`} alt={brand.name} className="max-h-full max-w-full object-contain" />
                                                        ) : (
                                                            <Package className="h-8 w-8 text-zinc-400" />
                                                        )}
                                                    </div>
                                                    <h3 className="font-extrabold text-lg group-hover:text-amber-600 transition-colors">{brand.name}</h3>
                                                    {brand.description && <p className="text-xs text-muted-foreground line-clamp-2">{brand.description}</p>}
                                                    <Badge variant="outline" className="text-[10px] rounded-full">{brand.products_count} products</Badge>
                                                </CardContent>
                                            </Card>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ── Featured Products ── */}
                    <section className="mx-auto max-w-6xl px-6 py-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Our Collection</p>
                                <h2 className="text-3xl font-extrabold tracking-tight">New Arrivals</h2>
                            </div>
                            <a href="/catalog" className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:gap-3 transition-all">View All <ArrowRight className="h-4 w-4" /></a>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
                        ) : (
                            <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {products.slice(0, 8).map((product) => (
                                    <a key={product.id} href={`/catalog/${product.slug}`} className="group">
                                        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                            <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center"><ShoppingCart className="h-12 w-12 text-zinc-300" /></div>
                                                )}
                                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                    {product.discount_percentage > 0 && <Badge className="bg-red-500 text-white text-[10px] px-2 border-0 shadow">-{product.discount_percentage}%</Badge>}
                                                    {product.is_bestseller && <Badge className="bg-amber-500 text-white text-[10px] px-2 border-0 shadow">Bestseller</Badge>}
                                                </div>
                                            </div>
                                            <CardContent className="p-4">
                                                {product.brand && <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">{product.brand.name}</p>}
                                                <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                                                {product.reviews_count > 0 && (
                                                    <div className="flex items-center gap-1 mt-1.5">
                                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                        <span className="text-xs font-bold">{product.reviews_avg_rating?.toFixed(1)}</span>
                                                        <span className="text-[10px] text-zinc-400">({product.reviews_count})</span>
                                                    </div>
                                                )}
                                                <p className="mt-2 text-base font-extrabold">{formatIDR(product.effective_price)}</p>
                                            </CardContent>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── Latest Blog ── */}
                    <section className="mx-auto max-w-6xl px-6 py-16 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">IKEO Journal</p>
                                <h2 className="text-3xl font-extrabold tracking-tight">Latest Articles</h2>
                            </div>
                            <a href="/blog" className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:gap-3 transition-all">View All <ArrowRight className="h-4 w-4" /></a>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {blogs.map((blog) => (
                                    <a key={blog.id} href={`/blog/${blog.slug}`} className="group">
                                        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                                            <div className="aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                                {blog.image ? (
                                                    <img src={blog.image} alt={blog.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center"><BookOpen className="h-10 w-10 text-zinc-300" /></div>
                                                )}
                                            </div>
                                            <CardContent className="p-5">
                                                <Badge variant="outline" className="text-[10px] rounded-full px-2 mb-3">{blog.category}</Badge>
                                                <h3 className="font-bold leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors">{blog.title}</h3>
                                                <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{blog.excerpt}</p>
                                            </CardContent>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── CTA ── */}
                    <section className="mx-auto max-w-6xl px-6 pb-16">
                        <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 p-10 sm:p-16 text-center text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
                            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
                            <div className="relative">
                                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to transform your space?</h2>
                                <p className="mt-4 text-zinc-400 max-w-lg mx-auto">Visit any of our 8 showrooms across Indonesia or book a free design consultation with our experts.</p>
                                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                    <a href="/catalog" className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all">Shop Now</a>
                                    <a href="/stores" className="rounded-2xl border border-zinc-600 px-8 py-3.5 text-sm font-bold hover:bg-white/10 transition-all">Find a Store</a>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
