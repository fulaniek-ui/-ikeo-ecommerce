import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Star, MessageSquare, Search, Trash2, Calendar, User, Package, Hash, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { Review, PaginatedData } from '@/types';

const columns: ColumnDef<Review>[] = [
  { 
    accessorKey: 'product.name', 
    header: 'Product',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
          <Package className="w-4 h-4" />
        </div>
        <span className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{row.original.product?.name || 'Deleted Product'}</span>
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
        <span className="text-sm font-medium">{row.original.user?.name || 'Anonymous'}</span>
      </div>
    )
  },
  { 
    accessorKey: 'rating', 
    header: 'Rating', 
    cell: ({ row }) => (
      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/50 w-fit">
        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
        <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{row.getValue('rating')} / 5</span>
      </div>
    )
  },
  { 
    accessorKey: 'comment', 
    header: 'Comment', 
    cell: ({ row }) => { 
      const c = row.getValue('comment') as string;
 
      return (
        <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400 italic">
          "{c || 'No comment provided.'}"
        </div>
      );
    } 
  },
  { 
    accessorKey: 'created_at', 
    header: 'Date', 
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        <Calendar className="w-3 h-3" />
        {new Date(row.getValue('created_at')).toLocaleDateString('id-ID')}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const review = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden min-w-[140px]">
            <DropdownMenuItem 
              onClick={() => {
 if(confirm('Delete this product review?')) {
router.visit(`/dashboard/reviews/${review.id}`, { method: 'delete' })
} 
}} 
              className="cursor-pointer py-2.5 px-3 focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-600 dark:focus:text-red-400 text-red-500 font-medium transition-colors gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Review
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
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
    <AppLayout breadcrumbs={[{ title: 'Product reviews', href: '/dashboard/reviews' }]}>
      <Head title="Reviews" />
      
      <div className="space-y-6 p-6 sm:p-8 lg:p-10">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
          </div>
          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Star className="w-7 h-7 text-white fill-white/30" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Customer Reviews
                </h1>
                <p className="text-amber-100/70 text-sm mt-0.5">
                  Monitor ratings and feedback to improve product quality
                </p>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-3 border-t border-white/10">
            {[
              { label: 'Total Reviews', value: reviews.total, icon: MessageSquare },
              { label: 'Current Page', value: `${reviews.current_page} / ${reviews.last_page}`, icon: Hash },
              { label: 'Showing', value: `${reviews.data.length} items`, icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-6 sm:px-8 py-4 border-r last:border-r-0 border-white/10">
                <s.icon className="w-4 h-4 text-amber-200/60 hidden sm:block" />
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-amber-200/60 uppercase tracking-wider">{s.label}</p>
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
              <MessageSquare className="w-4 h-4 text-amber-500" />
              Latest Feedback
            </CardTitle>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search by product name..." 
                value={search} 
                onChange={(e) => handleSearch(e.target.value)} 
                className="pl-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm focus-visible:ring-amber-500 h-10 w-full" 
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <DataTable columns={columns} data={reviews.data} />
          </CardContent>

          {reviews.last_page > 1 && (
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-center gap-1.5 flex-wrap">
              {reviews.links.map((link, i) => (
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
