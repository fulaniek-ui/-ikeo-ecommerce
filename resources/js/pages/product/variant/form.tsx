import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Product, ProductVariant } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
  product: Product;
  variant?: ProductVariant;
}

export default function Form({ product, variant }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    variant_name: variant?.variant_name ?? '',
    color: variant?.color ?? '',
    size: variant?.size ?? '',
    material: variant?.material ?? '',
    sku: variant?.sku ?? '',
    price: variant?.price ?? 0,
    stock: variant?.stock ?? 0,
    is_active: variant?.is_active ?? true,
    image: null as File | null,
    _method: variant ? 'PATCH' : 'POST',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const url = variant
      ? `/dashboard/products/${product.id}/variants/${variant.id}`
      : `/dashboard/products/${product.id}/variants`;
    post(url, { forceFormData: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Products', href: '/dashboard/products' }, { title: product.name, href: `/dashboard/products/${product.id}/variants` }, { title: variant ? 'Update Variant' : 'Create Variant', href: '#' }]}>
      <Head title={variant ? 'Update Variant' : 'Create Variant'} />
      <div className="max-w-2xl p-5">
        <div>
          <h3 className="text-lg font-medium">{variant ? 'Update' : 'Create'} Variant — {product.name}</h3>
          <Separator className="mt-5" />
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="variant_name">Variant Name</Label>
              <Input id="variant_name" value={data.variant_name} onChange={(e) => setData('variant_name', e.target.value)} />
              {errors.variant_name && <p className="mt-1 text-red-500">{errors.variant_name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" value={data.sku} onChange={(e) => setData('sku', e.target.value)} />
              {errors.sku && <p className="mt-1 text-red-500">{errors.sku}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" value={data.color} onChange={(e) => setData('color', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input id="size" value={data.size} onChange={(e) => setData('size', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input id="material" value={data.material} onChange={(e) => setData('material', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (IDR)</Label>
              <Input id="price" type="number" value={data.price} onChange={(e) => setData('price', parseFloat(e.target.value))} />
              {errors.price && <p className="mt-1 text-red-500">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" value={data.stock} onChange={(e) => setData('stock', parseInt(e.target.value))} />
              {errors.stock && <p className="mt-1 text-red-500">{errors.stock}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData('is_active', !!v)} />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            {variant?.image && <img src={variant.image.startsWith('http') ? variant.image : `/storage/${variant.image}`} alt="" className="h-20 w-20 rounded-md object-cover" />}
            <Input id="image" type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} />
            {errors.image && <p className="mt-1 text-red-500">{errors.image}</p>}
          </div>
          <Button disabled={processing} type="submit">{variant ? 'Update' : 'Submit'}</Button>
        </form>
      </div>
    </AppLayout>
  );
}
