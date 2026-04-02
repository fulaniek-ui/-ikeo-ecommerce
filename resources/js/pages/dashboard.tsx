import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardStats, Order, Product } from '@/types';
import { Package, Tag, Award, Users, ShoppingCart, TrendingUp, AlertTriangle, Archive } from 'lucide-react';

interface Props {
  stats: DashboardStats;
  latestOrders: Order[];
  latestProducts: Product[];
  lowStock: Product[];
}

const formatIDR = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

function StatCard({ title, value, icon: Icon, color, href }: { title: string; value: string | number; icon: React.ElementType; color: string; href: string }) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="flex items-center gap-4 p-5">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Dashboard({ stats, latestOrders, latestProducts, lowStock }: Props) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
      <Head title="Dashboard" />
      <div className="p-5 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, Admin 👋</h2>
          <p className="text-muted-foreground">Here's what's happening with IKEO today.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Categories" value={stats.categories} icon={Tag} color="bg-blue-500" href="/dashboard/categories" />
          <StatCard title="Brands" value={stats.brands} icon={Award} color="bg-purple-500" href="/dashboard/brands" />
          <StatCard title="Products" value={stats.products} icon={Package} color="bg-emerald-500" href="/dashboard/products" />
          <StatCard title="Customers" value={stats.users} icon={Users} color="bg-orange-500" href="/dashboard" />
          <StatCard title="Orders" value={stats.orders} icon={ShoppingCart} color="bg-pink-500" href="/dashboard/orders" />
          <StatCard title="Revenue" value={formatIDR(stats.revenue)} icon={TrendingUp} color="bg-green-600" href="/dashboard/orders" />
          <StatCard title="Total Stock" value={stats.totalStock} icon={Archive} color="bg-slate-500" href="/dashboard/products" />
          <StatCard title="Out of Stock" value={stats.outOfStock} icon={AlertTriangle} color="bg-red-500" href="/dashboard/products" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-4">Latest Orders</h3>
              {latestOrders.length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {latestOrders.map((order) => (
                    <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{order.order_number}</p>
                        <p className="text-xs text-muted-foreground">{order.user?.name} · {new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{formatIDR(order.total)}</p>
                        <Badge variant="outline" className="text-xs">{order.status}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-4">
                {lowStock.length > 0 ? '⚠️ Low Stock Alert' : 'Latest Products'}
              </h3>
              {(lowStock.length > 0 ? lowStock : latestProducts).length === 0 ? (
                <p className="text-muted-foreground text-sm">No products yet.</p>
              ) : (
                <div className="space-y-3">
                  {(lowStock.length > 0 ? lowStock : latestProducts).map((product) => (
                    <Link key={product.id} href={`/dashboard/products/${product.id}/edit`} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      {product.image ? (
                        <img src={product.image.startsWith('http') ? product.image : `/storage/${product.image}`} alt="" className="h-10 w-10 rounded-md object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category?.name} · {product.brand?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{formatIDR(product.price)}</p>
                        <Badge variant={product.stock <= 5 ? 'destructive' : 'outline'} className="text-xs">
                          Stock: {product.stock}
                        </Badge>
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
