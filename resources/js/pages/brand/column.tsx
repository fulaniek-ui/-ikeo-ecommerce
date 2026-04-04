'use client';

import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Brand } from '@/types';

export const columns: ColumnDef<Brand>[] = [
    {
        accessorKey: 'logo',
        header: '',
        cell: ({ row }) => {
            const logo = row.getValue('logo') as string;

            return logo ? (
                <div className="h-12 w-12 rounded-xl bg-white dark:bg-zinc-900 p-1.5 shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800 flex items-center justify-center">
                    <img src={logo.startsWith('http') ? logo : `/storage/${logo}`} alt="" className="max-h-full max-w-full object-contain rounded-md" />
                </div>
            ) : (
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-blue-400" />
                </div>
            );
        },
        size: 60,
    },
    {
        accessorKey: 'name',
        header: 'Brand',
        cell: ({ row }) => (
            <div className="flex flex-col gap-0.5">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{row.original.name}</span>
                {row.original.description && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-xs">{row.original.description}</span>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
        cell: ({ row }) => (
            <Badge variant="outline" className="font-mono text-[11px] px-2 py-0.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                {row.original.slug}
            </Badge>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const brand = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-zinc-200 dark:border-zinc-800 min-w-[150px]">
                        <DropdownMenuItem onClick={() => router.visit(`/dashboard/brands/${brand.id}/edit`)} className="cursor-pointer gap-2 font-medium">
                            <Pencil className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
 if (confirm('Delete this brand?')) {
router.visit(`/dashboard/brands/${brand.id}`, { method: 'delete' });
} 
}}
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
