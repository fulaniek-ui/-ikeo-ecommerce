import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, FileText, Plus, Search, BookOpen, User, Hash, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { Blog, PaginatedData } from '@/types';

const columns: ColumnDef<Blog>[] = [
  { 
    accessorKey: 'title', 
    header: 'Title',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{row.original.title}</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Category: {row.original.category}</span>
      </div>
    )
  },
  { 
    accessorKey: 'author.name', 
    header: 'Author',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
          {row.original.author?.name?.charAt(0) || <User className="w-3 h-3" />}
        </div>
        <span className="text-sm font-medium">{row.original.author?.name || 'Unknown'}</span>
      </div>
    )
  },
  { 
    accessorKey: 'published_at', 
    header: 'Status', 
    cell: ({ row }) => { 
      const d = row.getValue('published_at') as string;
 
      return (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${d ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'}`}>
          {d ? `Published on ${new Date(d).toLocaleDateString('id-ID')}` : 'Draft'}
        </div>
      );
    } 
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const blog = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden min-w-[140px]">
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/blogs/${blog.id}/edit`)} className="cursor-pointer py-2.5 px-3 focus:bg-zinc-100 dark:focus:bg-zinc-900 font-medium transition-colors">
              Edit Article
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
 if(confirm('Are you sure you want to delete this article?')) {
router.visit(`/dashboard/blogs/${blog.id}`, { method: 'delete' })
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

interface Props { blogs: PaginatedData<Blog>; filters: { search?: string }; }

export default function BlogPage({ blogs, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get('/dashboard/blogs', { search: value || undefined }, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Blog Content', href: '/dashboard/blogs' }]}>
      <Head title="Blogs" />
      
      <div className="space-y-6 p-6 sm:p-8 lg:p-10">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-700">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
          </div>
          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Publishing Center
                </h1>
                <p className="text-purple-100/70 text-sm mt-0.5">
                  Write and manage articles, guides, and updates
                </p>
              </div>
            </div>
            <Link href="/dashboard/blogs/create">
              <Button size="lg" className="rounded-xl bg-white text-purple-700 hover:bg-purple-50 shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all h-12 font-bold px-6">
                <Plus className="w-5 h-5 mr-2" />
                Write Article
              </Button>
            </Link>
          </div>

          <div className="relative grid grid-cols-3 border-t border-white/10">
            {[
              { label: 'Total Articles', value: blogs.total, icon: BookOpen },
              { label: 'Current Page', value: `${blogs.current_page} / ${blogs.last_page}`, icon: Hash },
              { label: 'Showing', value: `${blogs.data.length} items`, icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-6 sm:px-8 py-4 border-r last:border-r-0 border-white/10">
                <s.icon className="w-4 h-4 text-purple-200/60 hidden sm:block" />
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-purple-200/60 uppercase tracking-wider">{s.label}</p>
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
              <BookOpen className="w-4 h-4 text-purple-500" />
              All Articles
            </CardTitle>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search by title, category..." 
                value={search} 
                onChange={(e) => handleSearch(e.target.value)} 
                className="pl-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm focus-visible:ring-purple-500 h-10 w-full" 
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <DataTable columns={columns} data={blogs.data} />
          </CardContent>

          {blogs.last_page > 1 && (
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-center gap-1.5 flex-wrap">
              {blogs.links.map((link, i) => (
                <Button 
                  key={i} 
                  variant={link.active ? 'default' : 'outline'} 
                  size="sm" 
                  disabled={!link.url} 
                  onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} 
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`rounded-lg ${link.active ? 'bg-purple-600 hover:bg-purple-700 outline-none border-none shadow-md text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800'}`}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
