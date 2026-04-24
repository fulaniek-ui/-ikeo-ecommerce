import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MessageSquare, Search, Eye, Calendar, Store, Mail, Hash, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { Consultation, PaginatedData } from '@/types';

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200',
};

const columns: ColumnDef<Consultation>[] = [
  { 
    accessorKey: 'name', 
    header: 'Customer',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">{row.original.name}</span>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
          <Mail className="w-2.5 h-2.5" />
          {row.original.email}
        </div>
      </div>
    )
  },
  { 
    accessorKey: 'preferred_date', 
    header: 'Date', 
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
        {new Date(row.getValue('preferred_date')).toLocaleDateString('id-ID')}
      </div>
    )
  },
  { 
    accessorKey: 'store.name', 
    header: 'Location',
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
        <Store className="w-3.5 h-3.5" />
        <span className="text-sm font-medium">{row.original.store?.name || 'General'}</span>
      </div>
    )
  },
  { 
    accessorKey: 'status', 
    header: 'Status', 
    cell: ({ row }) => (
      <Badge className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${statusColor[row.original.status] || ''}`}>
        {row.original.status}
      </Badge>
    ) 
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/dashboard/consultations/${row.original.id}`}>
        <Button variant="outline" size="sm" className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 font-bold gap-2">
          <Eye className="w-3.5 h-3.5" />
          Review
        </Button>
      </Link>
    ),
  },
];

interface Props { consultations: PaginatedData<Consultation>; filters: { search?: string }; }

export default function ConsultationPage({ consultations, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get('/dashboard/consultations', { search: value || undefined }, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Consultations overview', href: '/dashboard/consultations' }]}>
      <Head title="Consultations" />
      
      <div className="space-y-6 p-6 sm:p-8 lg:p-10">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
          </div>
          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Interior Consultations
                </h1>
                <p className="text-indigo-100/70 text-sm mt-0.5">
                  Manage booking requests for showroom tours and design consultations
                </p>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-3 border-t border-white/10">
            {[
              { label: 'Total Bookings', value: consultations.total, icon: Calendar },
              { label: 'Current Page', value: `${consultations.current_page} / ${consultations.last_page}`, icon: Hash },
              { label: 'Showing', value: `${consultations.data.length} items`, icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-6 sm:px-8 py-4 border-r last:border-r-0 border-white/10">
                <s.icon className="w-4 h-4 text-indigo-200/60 hidden sm:block" />
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-indigo-200/60 uppercase tracking-wider">{s.label}</p>
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
              <Calendar className="w-4 h-4 text-indigo-500" />
              Appointment Queue
            </CardTitle>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search by name, email..." 
                value={search} 
                onChange={(e) => handleSearch(e.target.value)} 
                className="pl-10 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm focus-visible:ring-indigo-500 h-10 w-full" 
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <DataTable columns={columns} data={consultations.data} />
          </CardContent>

          {consultations.last_page > 1 && (
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-center gap-1.5 flex-wrap">
              {consultations.links.map((link, i) => (
                <Button 
                  key={i} 
                  variant={link.active ? 'default' : 'outline'} 
                  size="sm" 
                  disabled={!link.url} 
                  onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} 
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`rounded-lg ${link.active ? 'bg-indigo-600 hover:bg-indigo-700 outline-none border-none shadow-md text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800'}`}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
