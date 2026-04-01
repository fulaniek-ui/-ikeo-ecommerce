import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { Product, ProductVariant, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { columns } from './column';
import { useState } from 'react';

interface Props {
  product: Product;
  variants: PaginatedData<ProductVariant>;
  filters: { search?: string };
}

export default function VariantPage({ product, variants, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '');

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get(`/dashboard/products/${product.id}/variants`, { search: value || undefined }, { preserveState: true, replace: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Products', href: '/dashboard/products' }, { title: product.name, href: '#' }, { title: 'Variants', href: '#' }]}>
      <Head title={`${product.name} - Variants`} />
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{product.name} — Variants</h3>
            <p className="text-muted-foreground text-sm">Manage variants for this product.</p>
          </div>
          <Link href={`/dashboard/products/${product.id}/variants/create`}><Button>Create Variant</Button></Link>
        </div>
        <Input placeholder="Search variants..." value={search} onChange={(e) => handleSearch(e.target.value)} className="max-w-sm" />
        <DataTable columns={columns(product.id)} data={variants.data} />
        {variants.last_page > 1 && (
          <div className="flex items-center justify-center gap-1">
            {variants.links.map((link, i) => (
              <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
