import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Order, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { ShoppingCart, Search, LayoutGrid, Eye, Calendar, User, Truck, CreditCard } from 'lucide-react';

const formatIDR = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200',
};

const columns: ColumnDef<Order>[] = [
  { 
    accessorKey: 'order_number', 
    header: 'Order Details',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">#{row.original.order_number}</span>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          <Calendar className="w-3 h-3" />
          {new Date(row.original.created_at).toLocaleDateString('id-ID')}
        </div>
      </div>
    )
  },
  { 
    accessorKey: 'user.name', 
    header: 'Customer',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
          {row.original.user?.name?.charAt(0) || <User className="w-3 h-3" />}
        </div>
        <span className="text-sm font-medium">{row.original.user?.name || 'Guest'}</span>
      </div>
    )
  },
  { 
    accessorKey: 'status', 
    header: 'Status', 
    cell: ({ row }) => (
      <Badge className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border transition-colors ${statusColor[row.original.status] || ''}`}>
        {row.original.status}
      </Badge>
    ) 
  },
  { 
    accessorKey: 'courier', 
    header: 'Shipping',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
        <Truck className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold uppercase">{row.original.courier}</span>
      </div>
    )
  },
  { 
    accessorKey: 'total', 
    header: 'Total', 
    cell: ({ row }) => (
      <div className="font-bold text-emerald-600 dark:text-emerald-500">
        {formatIDR(parseFloat(row.getValue('total')))}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/dashboard/orders/${row.original.id}`}>
        <Button variant="outline" size="sm" className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 font-bold gap-2">
          <Eye className="w-3.5 h-3.5" />
          Details
        </Button>
      </Link>
    ),
  },
];

interface Props {
  orders: PaginatedData<Order>;
  filters: { search?: string; status?: string };
}

export default function OrderPage({ orders, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get('/dashboard/orders', { search: value || undefined }, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Orders overview', href: '/dashboard/orders' }]}>
      <Head title="Orders" />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Elegant Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-black dark:from-zinc-100 dark:to-zinc-400 flex items-center justify-center shadow-lg shadow-black/20 dark:shadow-white/10">
                <ShoppingCart className="w-6 h-6 text-white dark:text-zinc-900" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Sales Orders
              </h1>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl">
              Monitor incoming transactions, track shipping status, and manage customer payments effortlessly.
            </p>
          </div>
        </div>

        {/* Data Card Content */}
        <Card className="border-0 shadow-2xl shadow-zinc-200/50 dark:shadow-black/40 rounded-3xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                Order List ({orders.total})
              </CardTitle>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search by order number..." 
                value={search} 
                onChange={(e) => handleSearch(e.target.value)} 
                className="pl-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm focus-visible:ring-black h-10 w-full" 
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <DataTable columns={columns} data={orders.data} />
          </CardContent>

          {/* Pagination */}
          {orders.last_page > 1 && (
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-center gap-1.5 flex-wrap">
              {orders.links.map((link, i) => (
                <Button 
                  key={i} 
                  variant={link.active ? 'default' : 'outline'} 
                  size="sm" 
                  disabled={!link.url} 
                  onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} 
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`rounded-lg ${link.active ? 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 outline-none border-none shadow-md text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800'}`}
                />
              ))}
            </div>
          )}
        </Card>

      </div>
    </AppLayout>
  );
}
