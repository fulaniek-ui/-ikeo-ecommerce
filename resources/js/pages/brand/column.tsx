'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Brand } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: 'logo',
    header: 'Logo',
    cell: ({ row }) => {
      const logo = row.getValue('logo') as string;
      const src = logo?.startsWith('http') ? logo : `/storage/${logo}`;
      return <SafeImage src={src} alt="" className="h-10 w-10 rounded-xl object-contain shadow-sm border border-zinc-100 dark:border-zinc-800 p-1" />;
    },
  },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'slug', header: 'Slug' },
  {
    id: 'actions',
    cell: ({ row }) => {
      const brand = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/brands/${brand.id}/edit`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/brands/${brand.id}`, { method: 'delete' })}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
