'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProductVariant } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

const formatIDR = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

export const columns = (productId: number): ColumnDef<ProductVariant>[] => [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.getValue('image') as string;
      return image ? <img src={image.startsWith('http') ? image : `/storage/${image}`} alt="" className="h-10 w-10 rounded-md object-cover" /> : <div className="h-10 w-10 rounded-md bg-muted" />;
    },
  },
  { accessorKey: 'variant_name', header: 'Variant' },
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'color', header: 'Color' },
  { accessorKey: 'size', header: 'Size' },
  { accessorKey: 'price', header: 'Price', cell: ({ row }) => formatIDR(parseFloat(row.getValue('price'))) },
  { accessorKey: 'stock', header: 'Stock' },
  {
    id: 'actions',
    cell: ({ row }) => {
      const variant = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/products/${productId}/variants/${variant.id}/edit`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.visit(`/dashboard/products/${productId}/variants/${variant.id}`, { method: 'delete' })}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
