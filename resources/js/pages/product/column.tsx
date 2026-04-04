'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Product } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { SafeImage } from '@/components/safe-image';

const formatIDR = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

export const columns: ColumnDef<Product>[] = [
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
  { accessorKey: 'category.name', header: 'Category' },
  { accessorKey: 'brand.name', header: 'Brand' },
  { accessorKey: 'price', header: 'Price', cell: ({ row }) => formatIDR(parseFloat(row.getValue('price'))) },
  { accessorKey: 'stock', header: 'Stock' },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/products/${product.id}/variants`)}>Variants</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/products/${product.id}/edit`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/products/${product.id}`, { method: 'delete' })}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
