'use client';

import type { ColumnDef} from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { SearchX } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-hidden">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-zinc-50/80 dark:bg-zinc-900/60 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-800/60">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="h-11 px-5 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 border-none first:pl-6 last:pr-6">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, i) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className={`
                                    group border-b border-zinc-50 dark:border-zinc-900/50 
                                    hover:bg-indigo-50/40 dark:hover:bg-indigo-950/10 
                                    transition-all duration-200 
                                    ${i % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-zinc-50/30 dark:bg-zinc-900/20'}
                                `}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="px-5 py-4 border-none text-sm first:pl-6 last:pr-6">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="border-none p-0">
                                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                                    <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                        <SearchX className="h-7 w-7 text-zinc-300 dark:text-zinc-600" />
                                    </div>
                                    <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">No results found</p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Try adjusting your search or filters</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
