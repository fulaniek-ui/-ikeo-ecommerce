import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Package, Tag, Award, Users, ShoppingCart, TrendingUp,
    AlertTriangle, Archive, Star, MessageSquare, Clock,
    ArrowUpRight, Zap, Eye, Flame, Sparkles,
} from 'lucide-react';
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

const statusConfig: Record<string, { bg: string; dot: string }> = {
    pending: { bg: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', dot: 'bg-amber-500' },
    processing: { bg: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400', dot: 'bg-blue-500' },
    shipped: { bg: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400', dot: 'bg-purple-500' },
    delivered: { bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', dot: 'bg-emerald-500' },
    cancelled: { bg: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400', dot: 'bg-red-500' },
};

function MiniStat({ label, value, icon: Icon, color, href }: {
    label: string; value: string | number; icon: React.ElementType; color: string; href: string;
}) {
    return (
        <Link href={href} className="group">
            <div className="relative flex items-center gap-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 left-0 h-full w-1 ${color}`} />
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color} shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{label}</p>
                    <p className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{value}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
        </Link>
    );
}

function StarRating({ rating }: { rating: number | string | null }) {
    if (!rating) return <span className="text-[10px] text-zinc-400 italic">No reviews</span>;
    const n = Number(rating);
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`h-3 w-3 ${i <= Math.round(n) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`} />
            ))}
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 ml-1">{n.toFixed(1)}</span>
        </div>
    );
}

function ProductImage({ src, alt }: { src?: string | null; alt?: string }) {
    if (!src) return <div className="h-full w-full rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700" />;
    const url = src.startsWith('http') ? src : `/storage/${src}`;
    return <img src={url} alt={alt || ''} className="h-full w-full rounded-xl object-cover" />;
}

export default function Dashboard({ stats, latestOrders, latestProducts, lowStock, topProducts }: Props) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto">

                {/* ── Hero Banner ── */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-6 sm:p-8 text-white shadow-2xl shadow-indigo-500/20">
                    {/* Decorative circles */}
                    <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute top-1/2 right-1/4 h-24 w-24 rounded-full bg-cyan-400/20 blur-xl" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-cyan-200 text-sm mb-2">
                                <Clock className="h-4 w-4" />
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                                {greeting}, Admin <span className="inline-block animate-bounce">👋</span>
                            </h1>
                            <p className="text-blue-100 mt-2 max-w-md">
                                Here's what's happening with your IKEO store today. Stay on top of your business!
                            </p>
                        </div>

                        {/* Revenue quick stats */}
                        <div className="flex gap-4 sm:gap-6">
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 min-w-[140px]">
                                <p className="text-xs text-blue-200 font-medium">Total Revenue</p>
                                <p className="text-2xl font-black mt-1">{formatIDR(stats.revenue)}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Zap className="h-3 w-3 text-yellow-300" />
                                    <span className="text-[11px] text-cyan-200">Today: {formatIDR(stats.todayRevenue)}</span>
                                </div>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 min-w-[100px]">
                                <p className="text-xs text-blue-200 font-medium">Orders</p>
                                <p className="text-2xl font-black mt-1">{stats.orders}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                                    <span className="text-[11px] text-cyan-200">{stats.pendingOrders} pending</span>
                                </div>
                            </div>
                            <div className="hidden sm:block bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 min-w-[100px]">
                                <p className="text-xs text-blue-200 font-medium">Customers</p>
                                <p className="text-2xl font-black mt-1">{stats.users}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Users className="h-3 w-3 text-cyan-300" />
                                    <span className="text-[11px] text-cyan-200">registered</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Quick Stats Grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <MiniStat label="Categories" value={stats.categories} icon={Tag} color="bg-blue-500" href="/dashboard/categories" />
                    <MiniStat label="Brands" value={stats.brands} icon={Award} color="bg-violet-500" href="/dashboard/brands" />
                    <MiniStat label="Products" value={stats.products} icon={Package} color="bg-emerald-500" href="/dashboard/products" />
                    <MiniStat label="Reviews" value={stats.reviews} icon={Star} color="bg-amber-500" href="/dashboard/reviews" />
                    <MiniStat label="Out of Stock" value={stats.outOfStock} icon={AlertTriangle} color="bg-red-500" href="/dashboard/products" />
                    <MiniStat label="Consult" value={stats.consultations} icon={MessageSquare} color="bg-pink-500" href="/dashboard/consultations" />
                </div>

                {/* ── Main Content ── */}
                <div className="grid gap-6 lg:grid-cols-5">

                    {/* Recent Orders */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <div className="h-6 w-1.5 rounded-full bg-indigo-500" />
                                Recent Orders
                            </h2>
                            <Link href="/dashboard/orders" className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                                View all <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="space-y-2.5">
                            {latestOrders.length === 0 ? (
                                <Card className="border border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent shadow-none">
                                    <CardContent className="flex flex-col items-center justify-center py-16 text-zinc-400">
                                        <ShoppingCart className="h-10 w-10 mb-3 opacity-40" />
                                        <p className="text-sm font-medium">No orders yet</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                latestOrders.map((order) => {
                                    const sc = statusConfig[order.status] || statusConfig.pending;
                                    return (
                                        <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                                            <Card className="border-0 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group bg-white dark:bg-zinc-900/60">
                                                <CardContent className="flex items-center gap-4 p-4">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 group-hover:scale-110 transition-transform">
                                                        <ShoppingCart className="h-5 w-5 text-indigo-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{order.order_number}</p>
                                                        <p className="text-xs text-zinc-400">{order.user?.name} · {new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                                                    </div>
                                                    <div className="text-right space-y-1">
                                                        <p className="font-black text-sm">{formatIDR(order.total)}</p>
                                                        <Badge className={`text-[10px] px-2 py-0 border-0 font-bold inline-flex items-center gap-1 ${sc.bg}`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <div className="h-6 w-1.5 rounded-full bg-amber-500" />
                                Top Rated
                            </h2>
                            <Link href="/dashboard/products" className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1 transition-colors">
                                View all <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900/60">
                            <CardContent className="p-3 space-y-1">
                                {topProducts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                                        <Sparkles className="h-10 w-10 mb-3 opacity-40" />
                                        <p className="text-sm font-medium">No products yet</p>
                                    </div>
                                ) : (
                                    topProducts.map((product, i) => (
                                        <Link key={product.id} href={`/dashboard/products/${product.id}/edit`} className="flex items-center gap-3 rounded-xl p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all group">
                                            <div className="relative h-12 w-12 shrink-0">
                                                <ProductImage src={product.image} alt={product.name} />
                                                <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[10px] font-black text-white shadow-md ring-2 ring-white dark:ring-zinc-900">
                                                    {i + 1}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{product.name}</p>
                                                <StarRating rating={product.reviews_avg_rating} />
                                            </div>
                                            <span className="text-[11px] text-zinc-400 font-medium">{product.reviews_count}</span>
                                        </Link>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ── Bottom Section ── */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Low Stock */}
                    {lowStock.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <div className="h-6 w-1.5 rounded-full bg-red-500" />
                                    Low Stock Alert
                                </h2>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">{lowStock.length}</span>
                            </div>
                            <div className="space-y-2.5">
                                {lowStock.map((product) => (
                                    <Link key={product.id} href={`/dashboard/products/${product.id}/edit`}>
                                        <Card className="border-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-zinc-900/60 overflow-hidden">
                                            <CardContent className="flex items-center gap-4 p-4">
                                                <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden ring-2 ring-red-100 dark:ring-red-900/30">
                                                    <ProductImage src={product.image} alt={product.name} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate">{product.name}</p>
                                                    <p className="text-xs text-zinc-400">{product.category?.name}</p>
                                                </div>
                                                <div className="text-right space-y-1.5">
                                                    <Badge variant="destructive" className="text-[11px] font-black px-2">
                                                        <Flame className="h-3 w-3 mr-0.5" /> {product.stock} left
                                                    </Badge>
                                                    <div className="h-1.5 w-20 rounded-full bg-red-100 dark:bg-red-900/30 overflow-hidden">
                                                        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all" style={{ width: `${Math.min((product.stock / 10) * 100, 100)}%` }} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Latest Products */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <div className="h-6 w-1.5 rounded-full bg-emerald-500" />
                                New Arrivals
                            </h2>
                            <Link href="/dashboard/products" className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1 transition-colors">
                                View all <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="space-y-2.5">
                            {latestProducts.length === 0 ? (
                                <Card className="border border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent shadow-none">
                                    <CardContent className="flex flex-col items-center justify-center py-16 text-zinc-400">
                                        <Package className="h-10 w-10 mb-3 opacity-40" />
                                        <p className="text-sm font-medium">No products yet</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                latestProducts.map((product) => (
                                    <Link key={product.id} href={`/dashboard/products/${product.id}/edit`}>
                                        <Card className="border-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-zinc-900/60 group">
                                            <CardContent className="flex items-center gap-4 p-4">
                                                <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                                                    <ProductImage src={product.image} alt={product.name} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{product.name}</p>
                                                    <p className="text-xs text-zinc-400">{product.category?.name} · {product.brand?.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-sm">{formatIDR(product.price)}</p>
                                                    {product.discount_price && (
                                                        <p className="text-[10px] text-zinc-400 line-through">{formatIDR(product.discount_price)}</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
