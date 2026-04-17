import { Head, Link, usePage } from '@inertiajs/react';
import { Armchair, ShieldCheck, Truck, Headphones, Star, ArrowRight, ShoppingCart, BookOpen, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';

interface ProductItem {
    id: number; name: string; slug: string; price: number; effective_price: number;
    discount_percentage: number; image_url: string | null; is_bestseller: boolean;
    brand: { name: string } | null; reviews_count: number; reviews_avg_rating: number | null;
}
interface BlogItem {
    id: number; title: string; slug: string; excerpt: string;
    category: string; image: string | null; published_at: string;
}

const formatIDR = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/products?featured=1&per_page=8').then((r) => r.json()),
            fetch('/api/blogs?per_page=3').then((r) => r.json()),
        ]).then(([prodJson, blogJson]) => {
            setProducts(prodJson.data?.products || []);
            setBlogs(blogJson.data || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <>
            <Head title="IKEO — Scandinavian Furniture" />
            <div className="min-h-screen bg-[#FAFAF8] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Navigation */}
                <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg dark:bg-[#0a0a0a]/80">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <a href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-sm">IK</div>
                            <span className="text-xl font-bold tracking-wide">IKEO</span>
                        </a>
                        <nav className="flex items-center gap-1 sm:gap-3">
                            <a href="/catalog" className="rounded-lg px-3 sm:px-5 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors">Products</a>
                            <a href="/blog" className="rounded-lg px-3 sm:px-5 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors">Blog</a>
                            <a href="/stores" className="hidden sm:block rounded-lg px-3 sm:px-5 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors">Stores</a>
                            <a href="/consultation" className="hidden sm:block rounded-lg px-3 sm:px-5 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors">Consultation</a>
                            {auth.user ? (
                                <Link href={dashboard()} className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()} className="rounded-lg px-3 sm:px-5 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors">Log in</Link>
                                    {canRegister && (
                                        <Link href={register()} className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors">Register</Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-6">
                    {/* Hero */}
                    <section className="py-16 sm:py-24 text-center">
                        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-amber-600 dark:text-amber-400">Scandinavian Design</p>
                        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                            Furniture that feels<br /><span className="text-amber-500">like home</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#706f6c] dark:text-[#A1A09A]">
                            Discover minimalist Scandinavian furniture crafted with natural materials. Simple, functional, and beautifully designed for modern living.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-4">
                            <a href="/catalog" className="rounded-xl bg-[#1b1b18] px-8 py-3.5 text-sm font-semibold text-white hover:bg-black transition-colors dark:bg-white dark:text-black dark:hover:bg-[#e5e5e5]">
                                Shop Now
                            </a>
                            <a href="/blog" className="rounded-xl border border-[#e3e3e0] px-8 py-3.5 text-sm font-semibold hover:border-[#c5c5c0] transition-colors dark:border-[#3E3E3A] dark:hover:border-[#62605b]">
                                Read Blog
                            </a>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: Armchair, title: 'Premium Quality', desc: 'Crafted from solid oak, birch, and sustainable materials' },
                            { icon: Truck, title: 'Fast Delivery', desc: 'JNE, GoSend, SiCepat — delivered to your doorstep' },
                            { icon: ShieldCheck, title: 'Secure Payment', desc: 'Bank transfer & e-wallet via Xendit payment gateway' },
                            { icon: Headphones, title: 'Design Consultation', desc: 'Book a free session with our interior experts' },
                        ].map((f, i) => (
                            <div key={i} className="rounded-2xl border border-[#e3e3e0] bg-white p-6 transition-shadow hover:shadow-lg dark:border-[#3E3E3A] dark:bg-[#161615]">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10">
                                    <f.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="mb-1 font-semibold">{f.title}</h3>
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">{f.desc}</p>
                            </div>
                        ))}
                    </section>

                    {/* Featured Products */}
                    <section className="py-16 border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-widest text-amber-600 mb-1">Our Collection</p>
                                <h2 className="text-3xl font-extrabold tracking-tight">Featured Products</h2>
                            </div>
                            <a href="/catalog" className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:gap-3 transition-all">
                                View All <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                        {loading ? (
                            <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
                        ) : (
                            <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {products.slice(0, 8).map((product) => (
                                    <a key={product.id} href={`/catalog/${product.slug}`} className="group">
                                        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                            <div className="relative aspect-square overflow-hidden bg-muted/30">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center"><ShoppingCart className="h-12 w-12 text-muted-foreground/20" /></div>
                                                )}
                                                {product.discount_percentage > 0 && (
                                                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 border-0 shadow">-{product.discount_percentage}%</Badge>
                                                )}
                                                {product.is_bestseller && (
                                                    <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] px-2 border-0 shadow">Bestseller</Badge>
                                                )}
                                            </div>
                                            <CardContent className="p-4">
                                                {product.brand && <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">{product.brand.name}</p>}
                                                <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                                                {product.reviews_count > 0 && (
                                                    <div className="flex items-center gap-1 mt-1.5">
                                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                        <span className="text-xs font-medium">{product.reviews_avg_rating?.toFixed(1)}</span>
                                                        <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
                                                    </div>
                                                )}
                                                <p className="mt-2 text-base font-bold">{formatIDR(product.effective_price)}</p>
                                            </CardContent>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Latest Blog Articles */}
                    <section className="py-16 border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-widest text-amber-600 mb-1">IKEO Journal</p>
                                <h2 className="text-3xl font-extrabold tracking-tight">Latest Articles</h2>
                            </div>
                            <a href="/blog" className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:gap-3 transition-all">
                                View All <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                        {loading ? (
                            <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
                        ) : blogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <BookOpen className="h-12 w-12 mb-3 opacity-20" />
                                <p>No articles yet</p>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {blogs.map((blog) => (
                                    <a key={blog.id} href={`/blog/${blog.slug}`} className="group">
                                        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                                            <div className="aspect-[16/10] overflow-hidden bg-muted/30">
                                                {blog.image ? (
                                                    <img src={blog.image} alt={blog.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center"><BookOpen className="h-10 w-10 text-muted-foreground/20" /></div>
                                                )}
                                            </div>
                                            <CardContent className="p-5">
                                                <Badge variant="outline" className="text-[10px] rounded-full px-2 mb-3">{blog.category}</Badge>
                                                <h3 className="font-bold leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors">{blog.title}</h3>
                                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                                            </CardContent>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>
                </main>

                <footer className="border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                    <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        © {new Date().getFullYear()} IKEO. Scandinavian Furniture — Final Project Bootcamp.
                    </div>
                </footer>
            </div>
        </>
    );
}
