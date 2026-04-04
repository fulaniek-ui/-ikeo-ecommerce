'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, Layers, ImageIcon, Star } from 'lucide-react';

const formatIDR = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'image',
        header: '',
        cell: ({ row }) => {
            const image = row.getValue('image') as string;
            return image ? (
                <img src={image.startsWith('http') ? image : `/storage/${image}`} alt="" className="h-14 w-14 rounded-xl object-cover shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800" />
            ) : (
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-amber-400" />
                </div>
            );
        },
        size: 70,
    },
    {
        accessorKey: 'name',
        header: 'Product',
        cell: ({ row }) => (
            <div className="flex flex-col gap-1 min-w-0">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{row.original.name}</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                    {row.original.category?.name && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                            {row.original.category.name}
                        </Badge>
                    )}
                    {row.original.brand?.name && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
                            {row.original.brand.name}
                        </Badge>
                    )}
                    {row.original.is_bestseller && (
                        <Badge className="text-[10px] px-1.5 py-0 rounded-md bg-amber-500 text-white border-0">
                            <Star className="w-2.5 h-2.5 mr-0.5 fill-white" /> Best
                        </Badge>
                    )}
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{formatIDR(parseFloat(row.getValue('price')))}</span>
                {row.original.discount_price && (
                    <span className="text-[11px] text-red-500 line-through">{formatIDR(parseFloat(String(row.original.discount_price)))}</span>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => {
            const stock = row.getValue('stock') as number;
            const color = stock === 0
                ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400'
                : stock <= 5
                    ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400';
            return (
                <Badge variant="outline" className={`font-bold text-xs px-2 py-0.5 rounded-lg border ${color}`}>
                    {stock === 0 ? 'Out of stock' : `${stock} pcs`}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const product = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-zinc-200 dark:border-zinc-800 min-w-[160px]">
                        <DropdownMenuItem onClick={() => router.visit(`/dashboard/products/${product.id}/variants`)} className="cursor-pointer gap-2 font-medium">
                            <Layers className="w-4 h-4" /> Variants
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.visit(`/dashboard/products/${product.id}/edit`)} className="cursor-pointer gap-2 font-medium">
                            <Pencil className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => { if (confirm('Delete this product?')) router.visit(`/dashboard/products/${product.id}`, { method: 'delete' }); }}
                            className="cursor-pointer gap-2 font-medium text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
