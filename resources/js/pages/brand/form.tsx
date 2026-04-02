import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Brand } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props { brand?: Brand; }

export default function Form({ brand }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    name: brand?.name ?? '',
    description: brand?.description ?? '',
    logo: null as File | null,
    _method: brand ? 'PATCH' : 'POST',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const url = brand ? `/dashboard/brands/${brand.id}` : '/dashboard/brands';
    post(url, { forceFormData: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Brands', href: '/dashboard/brands' }, { title: brand ? 'Update' : 'Create', href: '#' }]}>
      <Head title={brand ? 'Update Brand' : 'Create Brand'} />
      <div className="max-w-2xl p-5">
        <div>
          <h3 className="text-lg font-medium">{brand ? 'Update' : 'Create'} Brand</h3>
          <Separator className="mt-5" />
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            {errors.name && <p className="mt-1 text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
            {errors.description && <p className="mt-1 text-red-500">{errors.description}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            {brand?.logo && <img src={brand.logo.startsWith('http') ? brand.logo : `/storage/${brand.logo}`} alt={brand.name} className="h-20 w-20 rounded-md object-cover" />}
            <Input id="logo" type="file" accept="image/*" onChange={(e) => setData('logo', e.target.files?.[0] ?? null)} />
            {errors.logo && <p className="mt-1 text-red-500">{errors.logo}</p>}
          </div>
          <Button disabled={processing} type="submit">{brand ? 'Update' : 'Submit'}</Button>
        </form>
      </div>
    </AppLayout>
  );
}
