import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Store as StoreIcon, Plus, Search, MapPin, Phone, Building2 } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import type { Store, PaginatedData } from '@/types';

const columns: ColumnDef<Store>[] = [
  { 
    accessorKey: 'name', 
    header: 'Store Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 dark:text-orange-400">
          <Building2 className="w-4 h-4" />
        </div>
        <span className="font-bold text-zinc-900 dark:text-zinc-100">{row.original.name}</span>
      </div>
    )
  },
  { 
    accessorKey: 'city', 
    header: 'Location',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
        <MapPin className="w-3.5 h-3.5" />
        <span className="text-sm font-medium">{row.original.city}</span>
      </div>
    )
  },
  { 
    accessorKey: 'phone', 
    header: 'Contact',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
        <Phone className="w-3.5 h-3.5" />
        <span className="text-sm font-medium">{row.original.phone || '-'}</span>
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const store = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden min-w-[140px]">
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/stores/${store.id}/edit`)} className="cursor-pointer py-2.5 border-b border-zinc-100 dark:border-zinc-900 px-3 focus:bg-zinc-100 dark:focus:bg-zinc-900 font-medium transition-colors">
              Edit Store
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
 if(confirm('Are you sure you want to delete this store location?')) {
router.visit(`/dashboard/stores/${store.id}`, { method: 'delete' })
} 
}} className="cursor-pointer py-2.5 px-3 focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-600 dark:focus:text-red-400 text-red-500 font-medium transition-colors">
              Delete
            </DropdownMenuItem>
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
    <AppLayout breadcrumbs={[{ title: 'Store locations', href: '/dashboard/stores' }]}>
      <Head title="Stores" />
      
      <div className="mx-auto p-6 sm:p-8 lg:p-10 space-y-8">
        
        {/* Elegant Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <StoreIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Outlets & Showrooms
              </h1>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl">
              Pin your physical locations on the map. Help customers find your showrooms for an in-person shopping experience.
            </p>
          </div>
          <Link href="/dashboard/stores/create">
            <Button size="lg" className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-white shadow-xl hover:-translate-y-0.5 transition-all w-full md:w-auto h-12 font-bold px-6">
              <Plus className="w-5 h-5 mr-2" />
              Add New Store
            </Button>
          </Link>
        </div>

        {/* Data Card Content */}
        <Card className="border-0 shadow-2xl shadow-zinc-200/50 dark:shadow-black/40 rounded-3xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                <MapPin className="w-5 h-5 text-orange-500" />
                Active Locations ({stores.total})
              </CardTitle>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                placeholder="Search by city, store name..." 
                value={search} 
                onChange={(e) => handleSearch(e.target.value)} 
                className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none w-full transition-all text-sm h-11" 
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <DataTable columns={columns} data={stores.data} />
          </CardContent>

          {/* Pagination */}
          {stores.last_page > 1 && (
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-center gap-1.5 flex-wrap">
              {stores.links.map((link, i) => (
                <Button 
                  key={i} 
                  variant={link.active ? 'default' : 'outline'} 
                  size="sm" 
                  disabled={!link.url} 
                  onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} 
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`rounded-lg ${link.active ? 'bg-orange-500 hover:bg-orange-600 outline-none border-none shadow-md text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800'}`}
                />
              ))}
            </div>
          )}
        </Card>

      </div>
    </AppLayout>
  );
}
