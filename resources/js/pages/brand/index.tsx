import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Brand, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { columns } from './column';
import { useState } from 'react';

interface Props {
  brands: PaginatedData<Brand>;
  filters: { search?: string };
}

export default function BrandPage({ brands, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get('/dashboard/brands', { search: value || undefined }, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Brands', href: '/dashboard/brands' }]}>
      <Head title="Brands" />
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Brands</h3>
            <p className="text-muted-foreground text-sm">Manage product brands.</p>
          </div>
          <Link href="/dashboard/brands/create"><Button>Create Brand</Button></Link>
        </div>
        <Input placeholder="Search brands..." value={search} onChange={(e) => handleSearch(e.target.value)} className="max-w-sm" />
        <DataTable columns={columns} data={brands.data} />
        {brands.last_page > 1 && (
          <div className="flex items-center justify-center gap-1">
            {brands.links.map((link, i) => (
              <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
