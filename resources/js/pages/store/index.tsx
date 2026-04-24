import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Store as StoreIcon, Plus, Search, MapPin, Phone, Building2, Hash, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
      
      <div className="space-y-6 p-6 sm:p-8 lg:p-10">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-rose-600">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
          </div>
          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <StoreIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Outlets & Showrooms
                </h1>
                <p className="text-orange-100/70 text-sm mt-0.5">
                  Manage your physical store locations across Indonesia
                </p>
              </div>
            </div>
            <Link href="/dashboard/stores/create">
              <Button size="lg" className="rounded-xl bg-white text-orange-700 hover:bg-orange-50 shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all h-12 font-bold px-6">
                <Plus className="w-5 h-5 mr-2" />
                Add New Store
              </Button>
            </Link>
          </div>

          <div className="relative grid grid-cols-3 border-t border-white/10">
            {[
              { label: 'Total Stores', value: stores.total, icon: StoreIcon },
              { label: 'Current Page', value: `${stores.current_page} / ${stores.last_page}`, icon: Hash },
              { label: 'Showing', value: `${stores.data.length} items`, icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-6 sm:px-8 py-4 border-r last:border-r-0 border-white/10">
                <s.icon className="w-4 h-4 text-orange-200/60 hidden sm:block" />
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-orange-200/60 uppercase tracking-wider">{s.label}</p>
                  <p className="text-lg sm:text-xl font-black text-white">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table Card */}
        <Card className="border-0 shadow-xl shadow-zinc-200/50 dark:shadow-black/40 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/80">
          <CardHeader className="bg-zinc-50/80 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Active Locations
            </CardTitle>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search by city, store name..." 
                value={search} 
                onChange={(e) => handleSearch(e.target.value)} 
                className="pl-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm focus-visible:ring-orange-500 h-10 w-full" 
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <DataTable columns={columns} data={stores.data} />
          </CardContent>

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
