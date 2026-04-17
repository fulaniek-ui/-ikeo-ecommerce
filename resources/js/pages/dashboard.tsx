import { Head, Link } from '@inertiajs/react';
import {
    Package, Tag, Award, Users, ShoppingCart,
    AlertTriangle, Star, MessageSquare, Clock,
    ArrowUpRight, TrendingUp, Flame, Sparkles,
    DollarSign, Eye, BarChart3, Activity,
    ChevronRight, Truck, CheckCircle2, XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import type { DashboardStats, Order, Product } from '@/types';

interface Props {
    stats: DashboardStats & { pendingOrders: number; todayRevenue: number; reviews: number; consultations: number };
    latestOrders: Order[];
    latestProducts: Product[];
    lowStock: Product[];
    topProducts: (Product & { reviews_count: number; reviews_avg_rating: number | null })[];
}

const formatIDR = (v: number | null | undefined) => {
    if (!v) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
};

const formatCompact = (v: number) => {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    return v.toString();
};

const statusIcon: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
    processing: { icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    shipped: { icon: Truck, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40' },
    delivered: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/40' },
};

function ProductImage({ src, alt }: { src?: string | null; alt?: string }) {
    if (!src) return <div className="h-full w-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700" />;
    const url = src.startsWith('http') ? src : `/storage/${src}`;
    return <img src={url} alt={alt || ''} className="h-full w-full object-cover" />;
}

function StarRating({ rating }: { rating: number | string | null }) {
    if (!rating) return <span className="text-xs text-zinc-400 italic">No reviews</span>;
    const n = Number(rating);
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(n) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`} />
            ))}
            <span className="text-xs font-bold text-zinc-500 ml-1">{n.toFixed(1)}</span>
        </div>
    );
}

export default function Dashboard({ stats, latestOrders, latestProducts, lowStock, topProducts }: Props) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Selamat Pagi' : hour < 18 ? 'Selamat Siang' : 'Selamat Malam';

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="p-6 sm:p-8 lg:p-10 space-y-8">

                {/* ═══ HERO BANNER — compact ═══ */}
                <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #003d82 0%, #0058a3 40%, #006fbe 100%)' }}>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background: '#ffdb00' }} />
                        <div className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full opacity-5" style={{ background: '#ffdb00' }} />
                        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,219,0,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,219,0,.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    </div>

                    <div className="relative p-6 sm:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: 'rgba(255,219,0,0.15)', color: '#ffdb00' }}>
                                    <Clock className="h-3.5 w-3.5" />
                                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                    {greeting}, Admin! <span className="inline-block animate-bounce">👋</span>
                                </h1>
                                <p className="text-blue-200/70 mt-1 text-sm max-w-lg">
                                    Kelola toko IKEO Anda dari sini. Pantau penjualan, produk, dan pesanan.
                                </p>
                            </div>

                            <div className="flex gap-3 flex-wrap lg:flex-nowrap">
                                <div className="flex-1 min-w-[140px] rounded-xl p-4 backdrop-blur-md border border-white/10" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#ffdb00' }}>
                                            <DollarSign className="h-4 w-4 text-[#003d82]" />
                                        </div>
                                        <span className="text-xs font-semibold text-blue-200/70 uppercase tracking-wider">Revenue</span>
                                    </div>
                                    <p className="text-2xl font-black text-white tracking-tight">{formatCompact(stats.revenue)}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <TrendingUp className="h-3 w-3" style={{ color: '#ffdb00' }} />
                                        <span className="text-[11px] font-semibold text-blue-200/60">Today: {formatIDR(stats.todayRevenue)}</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[120px] rounded-xl p-4 backdrop-blur-md border border-white/10" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#ffdb00' }}>
                                            <ShoppingCart className="h-4 w-4 text-[#003d82]" />
                                        </div>
                                        <span className="text-xs font-semibold text-blue-200/70 uppercase tracking-wider">Orders</span>
                                    </div>
                                    <p className="text-2xl font-black text-white">{stats.orders}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: '#ffdb00' }} />
                                        <span className="text-[11px] font-semibold text-blue-200/60">{stats.pendingOrders} pending</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[110px] rounded-xl p-4 backdrop-blur-md border border-white/10" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#ffdb00' }}>
                                            <Users className="h-4 w-4 text-[#003d82]" />
                                        </div>
                                        <span className="text-xs font-semibold text-blue-200/70 uppercase tracking-wider">Users</span>
                                    </div>
                                    <p className="text-2xl font-black text-white">{stats.users}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Eye className="h-3 w-3 text-blue-200/50" />
                                        <span className="text-[11px] font-semibold text-blue-200/60">registered</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ QUICK STATS ═══ */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: 'Categories', value: stats.categories, icon: Tag, gradient: 'from-blue-500 to-blue-600', href: '/dashboard/categories' },
                        { label: 'Brands', value: stats.brands, icon: Award, gradient: 'from-violet-500 to-violet-600', href: '/dashboard/brands' },
                        { label: 'Products', value: stats.products, icon: Package, gradient: 'from-emerald-500 to-emerald-600', href: '/dashboard/products' },
                        { label: 'Reviews', value: stats.reviews, icon: Star, gradient: 'from-amber-500 to-amber-600', href: '/dashboard/reviews' },
                        { label: 'Out of Stock', value: stats.outOfStock, icon: AlertTriangle, gradient: 'from-red-500 to-red-600', href: '/dashboard/products' },
                        { label: 'Consultations', value: stats.consultations, icon: MessageSquare, gradient: 'from-pink-500 to-pink-600', href: '/dashboard/consultations' },
                    ].map((item) => (
                        <Link key={item.label} href={item.href} className="group">
                            <div className="relative rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/50 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                                        <item.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{item.label}</p>
                                        <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{item.value}</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ═══ MAIN — Orders + Top Products ═══ */}
                <div className="grid gap-8 lg:grid-cols-5">
                    {/* Recent Orders */}
                    <div className="lg:col-span-3">
                        <div className="rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#0058a3' }}>
                                        <BarChart3 className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Recent Orders</h2>
                                        <p className="text-xs text-zinc-400">Latest transactions</p>
                                    </div>
                                </div>
                                <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800" style={{ color: '#0058a3' }}>
                                    View all <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            {latestOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                                    <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
                                    <p className="text-sm font-medium">No orders yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-50 dark:divide-zinc-800/30">
                                    {latestOrders.map((order) => {
                                        const st = statusIcon[order.status] || statusIcon.pending;
                                        const StIcon = st.icon;
                                        return (
                                            <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/20 transition-colors group">
                                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${st.bg}`}>
                                                    <StIcon className={`h-5 w-5 ${st.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-[#0058a3] transition-colors">{order.order_number}</p>
                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-semibold capitalize border-zinc-200 dark:border-zinc-700">{order.status}</Badge>
                                                    </div>
                                                    <p className="text-xs text-zinc-400 mt-0.5">{order.user?.name} · {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                                </div>
                                                <p className="font-black text-sm text-zinc-900 dark:text-zinc-100 tabular-nums">{formatIDR(order.total)}</p>
                                                <ChevronRight className="h-4 w-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Rated */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#ffdb00' }}>
                                        <Sparkles className="h-5 w-5 text-[#003d82]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Top Rated</h2>
                                        <p className="text-xs text-zinc-400">Best reviewed products</p>
                                    </div>
                                </div>
                                <Link href="/dashboard/products" className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800" style={{ color: '#0058a3' }}>
                                    View all <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            {topProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                                    <Sparkles className="h-12 w-12 mb-3 opacity-30" />
                                    <p className="text-sm font-medium">No products yet</p>
                                </div>
                            ) : (
                                <div className="p-3 space-y-1">
                                    {topProducts.map((product, i) => (
                                        <Link key={product.id} href={`/dashboard/products/${product.id}/edit`} className="flex items-center gap-4 rounded-xl p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all group">
                                            <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden ring-1 ring-zinc-100 dark:ring-zinc-800">
                                                <ProductImage src={product.image} alt={product.name} />
                                                <span className="absolute -top-0.5 -left-0.5 flex h-5 w-5 items-center justify-center rounded-br-lg text-[10px] font-black text-[#003d82]" style={{ background: '#ffdb00' }}>{i + 1}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate group-hover:text-[#0058a3] transition-colors">{product.name}</p>
                                                <StarRating rating={product.reviews_avg_rating} />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-400 tabular-nums">{product.reviews_count} reviews</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══ BOTTOM — Low Stock + New Arrivals ═══ */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {lowStock.length > 0 && (
                        <div className="rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-red-500 flex items-center justify-center pulse-glow-red">
                                        <AlertTriangle className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Low Stock Alert</h2>
                                        <p className="text-xs text-zinc-400">{lowStock.length} products need restock</p>
                                    </div>
                                </div>
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-black text-white">{lowStock.length}</span>
                            </div>
                            <div className="divide-y divide-zinc-50 dark:divide-zinc-800/30">
                                {lowStock.map((product) => (
                                    <Link key={product.id} href={`/dashboard/products/${product.id}/edit`} className="flex items-center gap-4 px-6 py-4 hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-colors">
                                        <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden ring-2 ring-red-100 dark:ring-red-900/30">
                                            <ProductImage src={product.image} alt={product.name} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{product.name}</p>
                                            <p className="text-xs text-zinc-400">{product.category?.name}</p>
                                        </div>
                                        <Badge variant="destructive" className="text-[10px] font-black px-2.5 py-0.5">
                                            <Flame className="h-3 w-3 mr-0.5" /> {product.stock} left
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/50">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">New Arrivals</h2>
                                    <p className="text-xs text-zinc-400">Recently added products</p>
                                </div>
                            </div>
                            <Link href="/dashboard/products" className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800" style={{ color: '#0058a3' }}>
                                View all <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                        {latestProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                                <Package className="h-12 w-12 mb-3 opacity-30" />
                                <p className="text-sm font-medium">No products yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-50 dark:divide-zinc-800/30">
                                {latestProducts.map((product) => (
                                    <Link key={product.id} href={`/dashboard/products/${product.id}/edit`} className="flex items-center gap-4 px-6 py-4 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 transition-colors group">
                                        <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden ring-1 ring-zinc-100 dark:ring-zinc-800 group-hover:ring-emerald-200 transition-all">
                                            <ProductImage src={product.image} alt={product.name} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate group-hover:text-emerald-600 transition-colors">{product.name}</p>
                                            <p className="text-xs text-zinc-400">{product.category?.name} · {product.brand?.name}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-black text-sm tabular-nums">{formatIDR(product.price)}</p>
                                            {product.discount_price && <p className="text-[10px] text-zinc-400 line-through tabular-nums">{formatIDR(product.discount_price)}</p>}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
