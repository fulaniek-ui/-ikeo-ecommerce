'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Brand } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: 'logo',
    header: 'Logo',
    cell: ({ row }) => {
      const logo = row.getValue('logo') as string;
      return logo ? <img src={`/storage/${logo}`} alt="" className="h-10 w-10 rounded-md object-cover" /> : <div className="h-10 w-10 rounded-md bg-muted" />;
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
