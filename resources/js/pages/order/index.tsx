import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Order, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

const formatIDR = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

const columns: ColumnDef<Order>[] = [
  { accessorKey: 'order_number', header: 'Order #' },
  { accessorKey: 'user.name', header: 'Customer' },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline">{row.getValue('status')}</Badge> },
  { accessorKey: 'courier', header: 'Courier' },
  { accessorKey: 'total', header: 'Total', cell: ({ row }) => formatIDR(parseFloat(row.getValue('total'))) },
  { accessorKey: 'created_at', header: 'Date', cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString('id-ID') },
  {
    id: 'actions',
    cell: ({ row }) => <Link href={`/dashboard/orders/${row.original.id}`}><Button variant="outline" size="sm">View</Button></Link>,
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
    <AppLayout breadcrumbs={[{ title: 'Orders', href: '/dashboard/orders' }]}>
      <Head title="Orders" />
      <div className="p-5 space-y-5">
        <h3 className="text-lg font-medium">Orders</h3>
        <Input placeholder="Search by order number..." value={search} onChange={(e) => handleSearch(e.target.value)} className="max-w-sm" />
        <DataTable columns={columns} data={orders.data} />
        {orders.last_page > 1 && (
          <div className="flex items-center justify-center gap-1">
            {orders.links.map((link, i) => (
              <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
