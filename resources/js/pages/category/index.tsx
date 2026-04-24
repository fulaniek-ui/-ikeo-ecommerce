import { Head, Link, router } from '@inertiajs/react';
import { Tag, Plus, Search, FolderTree, Hash, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { Category, PaginatedData } from '@/types';
import { columns } from './column';

interface Props {
  categories: PaginatedData<Category>;
  filters: { search?: string };
}

export default function CategoryPage({ categories, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get('/dashboard/categories', { search: value || undefined }, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Categories overview', href: '/dashboard/categories' }]}>
      <Head title="Categories" />
      
      <div className="space-y-6 p-6 sm:p-8 lg:p-10">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/[0.02]" />
          </div>
          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <FolderTree className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Product Categories
                </h1>
                <p className="text-emerald-100/70 text-sm mt-0.5">
                  Organize your inventory into clear, browsable groups
                </p>
              </div>
            </div>
            <Link href="/dashboard/categories/create">
              <Button size="lg" className="rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all h-12 font-bold px-6">
                <Plus className="w-5 h-5 mr-2" />
                Add Category
              </Button>
            </Link>
          </div>

          {/* Inline Stats */}
          <div className="relative grid grid-cols-3 border-t border-white/10">
            {[
              { label: 'Total Categories', value: categories.total, icon: Tag },
              { label: 'Current Page', value: `${categories.current_page} / ${categories.last_page}`, icon: Hash },
              { label: 'Showing', value: `${categories.data.length} items`, icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-6 sm:px-8 py-4 border-r last:border-r-0 border-white/10">
                <s.icon className="w-4 h-4 text-emerald-200/60 hidden sm:block" />
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-emerald-200/60 uppercase tracking-wider">{s.label}</p>
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
              <Tag className="w-4 h-4 text-emerald-500" />
              Category List
            </CardTitle>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search categories..." 
                value={search} 
                onChange={(e) => handleSearch(e.target.value)} 
                className="pl-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm focus-visible:ring-emerald-500 h-10 w-full" 
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <DataTable columns={columns} data={categories.data} />
          </CardContent>

          {categories.last_page > 1 && (
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-center gap-1.5 flex-wrap">
              {categories.links.map((link, i) => (
                <Button 
                  key={i} 
                  variant={link.active ? 'default' : 'outline'} 
                  size="sm" 
                  disabled={!link.url} 
                  onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} 
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`rounded-lg ${link.active ? 'bg-emerald-500 hover:bg-emerald-600 outline-none border-none shadow-md text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800'}`}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
