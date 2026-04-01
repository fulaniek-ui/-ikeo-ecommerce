import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Consultation, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

const columns: ColumnDef<Consultation>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'preferred_date', header: 'Date', cell: ({ row }) => new Date(row.getValue('preferred_date')).toLocaleDateString('id-ID') },
  { accessorKey: 'store.name', header: 'Store' },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline">{row.getValue('status')}</Badge> },
  {
    id: 'actions',
    cell: ({ row }) => <Link href={`/dashboard/consultations/${row.original.id}`}><Button variant="outline" size="sm">View</Button></Link>,
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
    <AppLayout breadcrumbs={[{ title: 'Consultations', href: '/dashboard/consultations' }]}>
      <Head title="Consultations" />
      <div className="p-5 space-y-5">
        <h3 className="text-lg font-medium">Consultations</h3>
        <Input placeholder="Search by name..." value={search} onChange={(e) => handleSearch(e.target.value)} className="max-w-sm" />
        <DataTable columns={columns} data={consultations.data} />
        {consultations.last_page > 1 && (
          <div className="flex items-center justify-center gap-1">
            {consultations.links.map((link, i) => (
              <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
