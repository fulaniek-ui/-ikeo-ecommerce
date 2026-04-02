import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Category } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
  category?: Category;
}

export default function Form({ category }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    name: category?.name ?? '',
    name_id: category?.name_id ?? '',
    icon: category?.icon ?? '',
    description: category?.description ?? '',
    description_id: category?.description_id ?? '',
    image: null as File | null,
    _method: category ? 'PATCH' : 'POST',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (category) {
      post(`/dashboard/categories/${category.id}`, { forceFormData: true });
    } else {
      post('/dashboard/categories', { forceFormData: true });
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Categories', href: '/dashboard/categories' }, { title: category ? 'Update' : 'Create', href: '#' }]}>
      <Head title={category ? 'Update Category' : 'Create Category'} />
      <div className="max-w-2xl p-5">
        <div>
          <h3 className="text-lg font-medium">{category ? 'Update' : 'Create'} Category</h3>
          <p className="text-muted-foreground text-sm">{category ? 'Update the category details.' : 'Fill out the form to add a new category.'}</p>
          <Separator className="mt-5" />
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (EN)</Label>
              <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
              {errors.name && <p className="mt-1 text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_id">Name (ID)</Label>
              <Input id="name_id" value={data.name_id} onChange={(e) => setData('name_id', e.target.value)} />
              {errors.name_id && <p className="mt-1 text-red-500">{errors.name_id}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Input id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} placeholder="e.g. sofa, bed, lamp" />
            {errors.icon && <p className="mt-1 text-red-500">{errors.icon}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (EN)</Label>
            <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
            {errors.description && <p className="mt-1 text-red-500">{errors.description}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_id">Description (ID)</Label>
            <Textarea id="description_id" value={data.description_id} onChange={(e) => setData('description_id', e.target.value)} />
            {errors.description_id && <p className="mt-1 text-red-500">{errors.description_id}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            {category?.image && <img src={category.image.startsWith('http') ? category.image : `/storage/${category.image}`} alt={category.name} className="h-20 w-20 rounded-md object-cover" />}
            <Input id="image" type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} />
            {errors.image && <p className="mt-1 text-red-500">{errors.image}</p>}
          </div>
          <Button disabled={processing} type="submit">{category ? 'Update' : 'Submit'}</Button>
        </form>
      </div>
    </AppLayout>
  );
}
