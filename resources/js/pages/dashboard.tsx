import * as React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Tag, Award, Users, ShoppingCart, TrendingUp, AlertTriangle, Archive, Star, MessageSquare, Clock, ArrowUpRight } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';
import type { DashboardStats, Order, Product } from '@/types';

interface Props {
  stats: DashboardStats & { pendingOrders: number; todayRevenue: number; reviews: number; consultations: number };
  latestOrders: Order[];
  latestProducts: Product[];
  lowStock: Product[];
  topProducts: (Product & { reviews_count: number; reviews_avg_rating: number | null })[];
}

const formatIDR = (v: number | null | undefined) => {
  if (v === null || v === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
};
const formatCompact = (v: number | null | undefined) => {
  if (v === null || v === undefined) return '0';
  return v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString();
};

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function GradientCard({ title, value, subtitle, icon: Icon, gradient, href }: {
  title: string; value: string | number; subtitle?: string; icon: React.ElementType; gradient: string; href: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className={`absolute inset-0 opacity-[0.08] ${gradient}`} />
        <CardContent className="relative flex items-center gap-4 p-5">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${gradient} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="text-2xl font-extrabold tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardContent>
      </Card>
    </Link>
  );
}

function StarRating({ rating }: { rating: number | string | null }) {
  if (!rating) return <span className="text-xs text-muted-foreground">No reviews</span>;
  const numRating = Number(rating);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-3 w-3 ${i <= Math.round(numRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
      ))}
      <span className="text-xs font-medium ml-1">{numRating.toFixed(1)}</span>
    </div>
  );
}

export default function Dashboard({ stats, latestOrders, latestProducts, lowStock, topProducts }: Props) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
      <Head title="Dashboard" />
      <div className="p-6 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Admin ✨
            </h2>
            <p className="text-muted-foreground mt-1">Here's your IKEO store overview for today.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Revenue highlight */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 relative overflow-hidden border-0 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-[0.06]" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-4xl font-extrabold tracking-tight mt-1">{formatIDR(stats.revenue)}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Today: <span className="font-semibold text-foreground">{formatIDR(stats.todayRevenue)}</span>
                  </p>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/20">
                  <TrendingUp className="h-9 w-9 text-white" />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-4 border-t pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="text-lg font-bold">{stats.orders}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-lg font-bold text-amber-600">{stats.pendingOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Customers</p>
                  <p className="text-lg font-bold">{stats.users}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="relative overflow-hidden border-0 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 opacity-[0.06]" />
              <CardContent className="relative flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-extrabold">{stats.outOfStock}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-0 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 opacity-[0.06]" />
              <CardContent className="relative flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending Consult</p>
                  <p className="text-2xl font-extrabold">{stats.consultations}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stat cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GradientCard title="Categories" value={stats.categories} icon={Tag} gradient="bg-gradient-to-br from-blue-500 to-cyan-500" href="/dashboard/categories" />
          <GradientCard title="Brands" value={stats.brands} icon={Award} gradient="bg-gradient-to-br from-purple-500 to-indigo-500" href="/dashboard/brands" />
          <GradientCard title="Products" value={stats.products} subtitle={`${formatCompact(stats.totalStock)} in stock`} icon={Package} gradient="bg-gradient-to-br from-emerald-500 to-teal-500" href="/dashboard/products" />
          <GradientCard title="Reviews" value={stats.reviews} icon={Star} gradient="bg-gradient-to-br from-amber-500 to-yellow-500" href="/dashboard/reviews" />
        </div>

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Latest Orders */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">Recent Orders</h3>
                <Link href="/dashboard/orders" className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              {latestOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {latestOrders.map((order) => (
                    <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40 transition-all duration-200 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                          <ShoppingCart className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{order.order_number}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.name} · {new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="font-bold text-sm">{formatIDR(order.total)}</p>
                          <Badge className={`text-[10px] px-2 py-0 border-0 ${statusColor[order.status] || ''}`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">Top Products</h3>
                <Link href="/dashboard/products" className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              {topProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">No products yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product, i) => (
                    <Link key={product.id} href={`/dashboard/products/${product.id}/edit`} className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/40 transition-all duration-200">
                      <div className="relative">
                        <SafeImage 
                          src={product.image?.startsWith('http') ? product.image : `/storage/${product.image}`} 
                          alt="" 
                          className="h-12 w-12 rounded-xl object-cover shadow-sm border border-zinc-100 dark:border-zinc-800" 
                        />
                        <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow">
                          {i + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{product.name}</p>
                        <StarRating rating={product.reviews_avg_rating} />
                      </div>
                      <span className="text-xs text-muted-foreground">{product.reviews_count} reviews</span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Low stock & Latest products */}
        <div className="grid gap-6 lg:grid-cols-2">
          {lowStock.length > 0 && (
            <Card className="border-0 shadow-sm border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-bold">Low Stock Alert</h3>
                </div>
                <div className="space-y-3">
                  {lowStock.map((product) => (
                    <Link key={product.id} href={`/dashboard/products/${product.id}/edit`} className="flex items-center gap-3 rounded-xl border border-red-100 dark:border-red-900/30 p-3 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all">
                      <SafeImage 
                        src={product.image?.startsWith('http') ? product.image : `/storage/${product.image}`} 
                        alt="" 
                        className="h-10 w-10 rounded-lg object-cover border border-red-200 dark:border-red-800" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="text-xs font-bold">
                          {product.stock} left
                        </Badge>
                        <div className="mt-1 h-1.5 w-16 rounded-full bg-red-100 dark:bg-red-900/30">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.min((product.stock / 10) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">Latest Products</h3>
                <Link href="/dashboard/products" className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              {latestProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">No products yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {latestProducts.map((product) => (
                    <Link key={product.id} href={`/dashboard/products/${product.id}/edit`} className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/40 transition-all duration-200">
                      <SafeImage 
                        src={product.image?.startsWith('http') ? product.image : `/storage/${product.image}`} 
                        alt="" 
                        className="h-12 w-12 rounded-xl object-cover shadow-sm border border-zinc-100 dark:border-zinc-800" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category?.name} · {product.brand?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{formatIDR(product.price)}</p>
                        {product.discount_price && (
                          <p className="text-[10px] text-muted-foreground line-through">{formatIDR(product.discount_price)}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </AppLayout>
  );
}
