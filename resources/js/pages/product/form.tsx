import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Category, Brand, Product } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
  product?: Product;
  categories: Pick<Category, 'id' | 'name'>[];
  brands: Pick<Brand, 'id' | 'name'>[];
}

export default function Form({ product, categories, brands }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    name: product?.name ?? '',
    category_id: product?.category_id?.toString() ?? '',
    brand_id: product?.brand_id?.toString() ?? '',
    description: product?.description ?? '',
    description_id: product?.description_id ?? '',
    price: product?.price ?? 0,
    discount_price: product?.discount_price ?? '',
    stock: product?.stock ?? 0,
    is_bestseller: product?.is_bestseller ?? false,
    is_featured: product?.is_featured ?? false,
    material: product?.material ?? '',
    dimensions: product?.dimensions ?? '',
    weight: product?.weight ?? '',
    image: null as File | null,
    _method: product ? 'PATCH' : 'POST',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const url = product ? `/dashboard/products/${product.id}` : '/dashboard/products';
    post(url, { forceFormData: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Products', href: '/dashboard/products' }, { title: product ? 'Update' : 'Create', href: '#' }]}>
      <Head title={product ? 'Update Product' : 'Create Product'} />
      <div className="max-w-2xl p-5">
        <div>
          <h3 className="text-lg font-medium">{product ? 'Update' : 'Create'} Product</h3>
          <Separator className="mt-5" />
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            {errors.name && <p className="mt-1 text-red-500">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              {errors.category_id && <p className="mt-1 text-red-500">{errors.category_id}</p>}
            </div>
            <div className="space-y-2">
              <Label>Brand</Label>
              <Select value={data.brand_id} onValueChange={(v) => setData('brand_id', v)}>
                <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                <SelectContent>{brands.map((b) => <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
              {errors.brand_id && <p className="mt-1 text-red-500">{errors.brand_id}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (IDR)</Label>
              <Input id="price" type="number" value={data.price} onChange={(e) => setData('price', parseFloat(e.target.value))} />
              {errors.price && <p className="mt-1 text-red-500">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount_price">Discount Price</Label>
              <Input id="discount_price" type="number" value={data.discount_price} onChange={(e) => setData('discount_price', e.target.value)} />
              {errors.discount_price && <p className="mt-1 text-red-500">{errors.discount_price}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" value={data.stock} onChange={(e) => setData('stock', parseInt(e.target.value))} />
              {errors.stock && <p className="mt-1 text-red-500">{errors.stock}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input id="material" value={data.material} onChange={(e) => setData('material', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input id="dimensions" value={data.dimensions} onChange={(e) => setData('dimensions', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" step="0.01" value={data.weight} onChange={(e) => setData('weight', e.target.value)} />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Checkbox id="is_bestseller" checked={data.is_bestseller} onCheckedChange={(v) => setData('is_bestseller', !!v)} />
              <Label htmlFor="is_bestseller">Bestseller</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="is_featured" checked={data.is_featured} onCheckedChange={(v) => setData('is_featured', !!v)} />
              <Label htmlFor="is_featured">Featured</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (EN)</Label>
            <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_id">Description (ID)</Label>
            <Textarea id="description_id" value={data.description_id} onChange={(e) => setData('description_id', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            {product?.image && <img src={product.image.startsWith('http') ? product.image : `/storage/${product.image}`} alt={product.name} className="h-20 w-20 rounded-md object-cover" />}
            <Input id="image" type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} />
            {errors.image && <p className="mt-1 text-red-500">{errors.image}</p>}
          </div>
          <Button disabled={processing} type="submit">{product ? 'Update' : 'Submit'}</Button>
        </form>
      </div>
    </AppLayout>
  );
}
