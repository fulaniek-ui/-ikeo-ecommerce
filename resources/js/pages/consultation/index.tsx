import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Consultation, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { MessageSquare, Search, Eye, Calendar, User, Mail, Phone, Store } from 'lucide-react';

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
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Elegant Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Interior Consultations
              </h1>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl">
              Manage booking requests for showroom tours and design consultations. Build strong connections with your customers.
            </p>
          </div>
        </div>

        {/* Data Card Content */}
        <Card className="border-0 shadow-2xl shadow-zinc-200/50 dark:shadow-black/40 rounded-3xl overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Appointment Queue ({consultations.total})
              </CardTitle>
            </div>
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

          {/* Pagination */}
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
