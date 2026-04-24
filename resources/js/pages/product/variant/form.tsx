import { Head, useForm, Link } from '@inertiajs/react';
import { Box, Image as ImageIcon, CircleDollarSign, ArrowLeft, Info, Save, Settings2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { SafeImage } from '@/components/safe-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { Product, ProductVariant } from '@/types';

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
      
      <div className="mx-auto p-6 sm:p-8 lg:p-10">
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Header Action Bar */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 p-6 sm:p-8">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Link href={`/dashboard/products/${product.id}/variants`} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/20">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <p className="text-indigo-200/70 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5" />
                    {product.name}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {variant ? 'Edit Variant' : 'Create New Variant'}
                  </h1>
                </div>
              </div>
              <Button disabled={processing} type="submit" size="lg" className="rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all h-12 px-8 font-bold">
                <Save className="w-5 h-5 mr-2" />
                {variant ? 'Save Changes' : 'Create Variant'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Main Information) */}
            <div className="lg:col-span-2 space-y-8">
              
              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-8 py-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Info className="w-5 h-5 text-blue-500" />
                    Variant Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="variant_name" className="text-sm font-semibold">Variant Name <span className="text-red-500">*</span></Label>
                      <Input id="variant_name" value={data.variant_name} onChange={(e) => setData('variant_name', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="e.g. XL - Matte Black" />
                      {errors.variant_name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.variant_name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku" className="text-sm font-semibold">SKU (Stock Keeping Unit)</Label>
                      <Input id="sku" value={data.sku} onChange={(e) => setData('sku', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 font-mono" placeholder="SKU-123456" />
                      {errors.sku && <p className="mt-1 text-sm text-red-500 font-medium">{errors.sku}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-8 py-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Settings2 className="w-5 h-5 text-purple-500" />
                    Specific Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="color" className="text-sm font-semibold">Color</Label>
                      <Input id="color" value={data.color} onChange={(e) => setData('color', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="Blue" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size" className="text-sm font-semibold">Size</Label>
                      <Input id="size" value={data.size} onChange={(e) => setData('size', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="Large" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="material" className="text-sm font-semibold">Material</Label>
                      <Input id="material" value={data.material} onChange={(e) => setData('material', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="Cotton" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-8 py-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <CircleDollarSign className="w-5 h-5 text-emerald-500" />
                    Pricing & Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-semibold">Variant Price (IDR)</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium font-mono text-sm">Rp</span>
                        <Input id="price" type="number" value={data.price} onChange={(e) => setData('price', parseFloat(e.target.value))} className="pl-11 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" />
                      </div>
                      {errors.price && <p className="mt-1 text-sm text-red-500 font-medium">{errors.price}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-sm font-semibold">Variant Stock</Label>
                      <Input id="stock" type="number" value={data.stock} onChange={(e) => setData('stock', parseInt(e.target.value))} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 font-mono text-lg" />
                      {errors.stock && <p className="mt-1 text-sm text-red-500 font-medium">{errors.stock}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
            </div>

            {/* Right Column (Sidebar Information) */}
            <div className="space-y-8">
              
              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <ImageIcon className="w-5 h-5 text-rose-500" />
                    Variant Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 bg-zinc-50 dark:bg-zinc-950/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer relative overflow-hidden">
                    {variant?.image ? (
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm">
                        <SafeImage 
                          src={variant.image.startsWith('http') ? variant.image : `/storage/${variant.image}`} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-medium shadow-sm">Click to change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center mx-auto mb-3">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Upload Image</p>
                      </div>
                    )}
                    <Input id="image" type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                  {errors.image && <p className="text-sm text-red-500 font-medium text-center">{errors.image}</p>}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData('is_active', !!v)} className="mt-1 w-5 h-5 rounded-md data-[state=checked]:bg-emerald-500 data-[state=checked]:border-none" />
                    <div>
                      <Label htmlFor="is_active" className="text-base font-bold cursor-pointer">Active Variant</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Allow customers to select and purchase this specific variant.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
