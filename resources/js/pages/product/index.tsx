import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Product, PaginatedData, Category, Brand } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { columns } from './column';
import { useState } from 'react';

interface Props {
  products: PaginatedData<Product>;
  filters: { search?: string };
  categories: Pick<Category, 'id' | 'name'>[];
  brands: Pick<Brand, 'id' | 'name'>[];
}

export default function ProductPage({ products, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get('/dashboard/products', { search: value || undefined }, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Products', href: '/dashboard/products' }]}>
      <Head title="Products" />
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Products</h3>
            <p className="text-muted-foreground text-sm">Manage your products.</p>
          </div>
          <Link href="/dashboard/products/create"><Button>Create Product</Button></Link>
        </div>
        <Input placeholder="Search products..." value={search} onChange={(e) => handleSearch(e.target.value)} className="max-w-sm" />
        <DataTable columns={columns} data={products.data} />
        {products.last_page > 1 && (
          <div className="flex items-center justify-center gap-1">
            {products.links.map((link, i) => (
              <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
