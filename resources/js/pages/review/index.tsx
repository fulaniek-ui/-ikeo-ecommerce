import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Review, PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const columns: ColumnDef<Review>[] = [
  { accessorKey: 'product.name', header: 'Product' },
  { accessorKey: 'user.name', header: 'User' },
  { accessorKey: 'rating', header: 'Rating', cell: ({ row }) => `⭐ ${row.getValue('rating')}/5` },
  { accessorKey: 'comment', header: 'Comment', cell: ({ row }) => { const c = row.getValue('comment') as string; return c ? (c.length > 80 ? c.slice(0, 80) + '...' : c) : '-'; } },
  { accessorKey: 'created_at', header: 'Date', cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString('id-ID') },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.visit(`/dashboard/reviews/${row.original.id}`, { method: 'delete' })}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface Props { reviews: PaginatedData<Review>; filters: { search?: string }; }

export default function ReviewPage({ reviews, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get('/dashboard/reviews', { search: value || undefined }, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Reviews', href: '/dashboard/reviews' }]}>
      <Head title="Reviews" />
      <div className="p-5 space-y-5">
        <h3 className="text-lg font-medium">Reviews</h3>
        <Input placeholder="Search by product name..." value={search} onChange={(e) => handleSearch(e.target.value)} className="max-w-sm" />
        <DataTable columns={columns} data={reviews.data} />
        {reviews.last_page > 1 && (
          <div className="flex items-center justify-center gap-1">
            {reviews.links.map((link, i) => (
              <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
