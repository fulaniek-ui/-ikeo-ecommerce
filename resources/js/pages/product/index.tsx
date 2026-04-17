import { Head, Link, router } from '@inertiajs/react';
import { PackagePlus, Search, LayoutGrid, Package } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { Product, PaginatedData, Category, Brand } from '@/types';
import { columns } from './column';

interface Props {
  products: PaginatedData<Product>;
  filters: { search?: string };
  categories: Pick<Category, 'id' | 'name'>[];
  brands: Pick<Brand, 'id' | 'name'>[];
}

export default function ProductPage({ products, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get('/dashboard/products', { search: value || undefined }, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Products overview', href: '/dashboard/products' }]}>
      <Head title="Products" />
      
      <div className="mx-auto p-6 sm:p-8 lg:p-10 space-y-8">
        
        {/* Elegant Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Product Catalog
              </h1>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl">
              Manage your store's inventory, update pricing, and organize product variants. Display what makes your items special.
            </p>
          </div>
          <Link href="/dashboard/products/create">
            <Button size="lg" className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-white shadow-xl hover:-translate-y-0.5 transition-all w-full md:w-auto h-12 font-bold px-6">
              <PackagePlus className="w-5 h-5 mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Data Card Content */}
        <Card className="border-0 shadow-2xl shadow-zinc-200/50 dark:shadow-black/40 rounded-3xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-amber-500" />
                All Products ({products.total})
              </CardTitle>
              <CardDescription className="mt-1">
                Showing your latest inventory updates.
              </CardDescription>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search by name, SKU..." 
                value={search} 
                onChange={(e) => handleSearch(e.target.value)} 
                className="pl-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm focus-visible:ring-amber-500 h-10 w-full" 
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <DataTable columns={columns} data={products.data} />
          </CardContent>

          {/* Pagination */}
          {products.last_page > 1 && (
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-center gap-1.5 flex-wrap">
              {products.links.map((link, i) => (
                <Button 
                  key={i} 
                  variant={link.active ? 'default' : 'outline'} 
                  size="sm" 
                  disabled={!link.url} 
                  onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} 
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`rounded-lg ${link.active ? 'bg-amber-500 hover:bg-amber-600 outline-none border-none shadow-md text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800'}`}
                />
              ))}
            </div>
          )}
        </Card>

      </div>
    </AppLayout>
  );
}
