import { Head, Link, router } from '@inertiajs/react';
import { Box, Layers, Plus, Search, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { Product, ProductVariant, PaginatedData } from '@/types';
import { columns } from './column';

interface Props {
  product: Product;
  variants: PaginatedData<ProductVariant>;
  filters: { search?: string };
}

export default function VariantPage({ product, variants, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get(`/dashboard/products/${product.id}/variants`, { search: value || undefined }, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Products', href: '/dashboard/products' }, { title: product.name, href: '#' }, { title: 'Variants', href: '#' }]}>
      <Head title={`${product.name} - Variants`} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Elegant Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/products" className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {product.name} Variants
                </h1>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl">
                Manage specific variations of {product.name} such as size, color, or material.
              </p>
            </div>
          </div>
          <Link href={`/dashboard/products/${product.id}/variants/create`}>
            <Button size="lg" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl hover:-translate-y-0.5 transition-all w-full md:w-auto h-11 font-bold px-6">
              <Plus className="w-5 h-5 mr-2" />
              Add Variant
            </Button>
          </Link>
        </div>

        {/* Data Card Content */}
        <Card className="border-0 shadow-2xl shadow-zinc-200/50 dark:shadow-black/40 rounded-3xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Box className="w-5 h-5 text-indigo-500" />
                Variant Options ({variants.total})
              </CardTitle>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search by SKU, color..." 
                value={search} 
                onChange={(e) => handleSearch(e.target.value)} 
                className="pl-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm focus-visible:ring-indigo-500 h-10 w-full" 
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <DataTable columns={columns(product.id)} data={variants.data} />
          </CardContent>

          {/* Pagination */}
          {variants.last_page > 1 && (
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-center gap-1.5 flex-wrap">
              {variants.links.map((link, i) => (
                <Button 
                  key={i} 
                  variant={link.active ? 'default' : 'outline'} 
                  size="sm" 
                  disabled={!link.url} 
                  onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} 
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`rounded-lg ${link.active ? 'bg-indigo-600 hover:bg-indigo-700 outline-none border-none shadow-md text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800'}`}
                />
              ))}
            </div>
          )}
        </Card>

      </div>
    </AppLayout>
  );
}
