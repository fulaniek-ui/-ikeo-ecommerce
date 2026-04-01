import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Store, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';

const columns: ColumnDef<Store>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'phone', header: 'Phone' },
  {
    id: 'actions',
    cell: ({ row }) => {
      const store = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/stores/${store.id}/edit`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/stores/${store.id}`, { method: 'delete' })}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface Props { stores: PaginatedData<Store>; filters: { search?: string }; }

export default function StorePage({ stores, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get('/dashboard/stores', { search: value || undefined }, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Stores', href: '/dashboard/stores' }]}>
      <Head title="Stores" />
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Stores</h3>
          <Link href="/dashboard/stores/create"><Button>Create Store</Button></Link>
        </div>
        <Input placeholder="Search stores..." value={search} onChange={(e) => handleSearch(e.target.value)} className="max-w-sm" />
        <DataTable columns={columns} data={stores.data} />
        {stores.last_page > 1 && (
          <div className="flex items-center justify-center gap-1">
            {stores.links.map((link, i) => (
              <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
