import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Blog, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';

const columns: ColumnDef<Blog>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'author.name', header: 'Author' },
  { accessorKey: 'published_at', header: 'Published', cell: ({ row }) => { const d = row.getValue('published_at') as string; return d ? new Date(d).toLocaleDateString('id-ID') : 'Draft'; } },
  {
    id: 'actions',
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/blogs/${blog.id}/edit`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/blogs/${blog.id}`, { method: 'delete' })}>Delete</DropdownMenuItem>
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
    <AppLayout breadcrumbs={[{ title: 'Blogs', href: '/dashboard/blogs' }]}>
      <Head title="Blogs" />
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Blogs</h3>
          <Link href="/dashboard/blogs/create"><Button>Create Blog</Button></Link>
        </div>
        <Input placeholder="Search blogs..." value={search} onChange={(e) => handleSearch(e.target.value)} className="max-w-sm" />
        <DataTable columns={columns} data={blogs.data} />
        {blogs.last_page > 1 && (
          <div className="flex items-center justify-center gap-1">
            {blogs.links.map((link, i) => (
              <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
