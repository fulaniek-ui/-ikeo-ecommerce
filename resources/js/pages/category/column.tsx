'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Category } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.getValue('image') as string;
      const src = image?.startsWith('http') ? image : `/storage/${image}`;
      return <SafeImage src={src} alt="" className="h-10 w-10 rounded-xl object-cover shadow-sm border border-zinc-100 dark:border-zinc-800" />;
    },
  },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'name_id', header: 'Name (ID)' },
  { accessorKey: 'slug', header: 'Slug' },
  {
    id: 'actions',
    cell: ({ row }) => {
      const category = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/categories/${category.id}/edit`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/categories/${category.id}`, { method: 'delete' })}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
