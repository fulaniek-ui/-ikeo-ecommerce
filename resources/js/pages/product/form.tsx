import { Head, useForm, Link } from '@inertiajs/react';
import { Package, Image as ImageIcon, Tags, CircleDollarSign, ArrowLeft, Info, Star, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { SafeImage } from '@/components/safe-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Category, Brand, Product } from '@/types';

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
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/products" className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {product ? 'Edit Product' : 'Create New Product'}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                  {product ? 'Update the details for this item.' : 'Add a brand new item to your store inventory.'}
                </p>
              </div>
            </div>
            <Button disabled={processing} type="submit" size="lg" className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 transition-all h-12 px-8 font-bold">
              <Save className="w-5 h-5 mr-2" />
              {product ? 'Save Changes' : 'Publish Product'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Main Information) */}
            <div className="lg:col-span-2 space-y-8">
              
              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-8 py-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Info className="w-5 h-5 text-blue-500" />
                    General Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Product Name <span className="text-red-500">*</span></Label>
                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="e.g. Scandi Wooden Chair" />
                    {errors.name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold">Description (English)</Label>
                    <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="min-h-[120px] rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="Describe the product details..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_id" className="text-sm font-semibold">Description (Indonesian)</Label>
                    <Textarea id="description_id" value={data.description_id} onChange={(e) => setData('description_id', e.target.value)} className="min-h-[120px] rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="Jelaskan detail produk..." />
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-semibold">Regular Price (IDR) <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium font-mono text-sm">Rp</span>
                        <Input id="price" type="number" value={data.price} onChange={(e) => setData('price', parseFloat(e.target.value))} className="pl-11 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" />
                      </div>
                      {errors.price && <p className="mt-1 text-sm text-red-500 font-medium">{errors.price}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount_price" className="text-sm font-semibold text-emerald-600 dark:text-emerald-500">Discount Price (IDR)</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium font-mono text-sm">Rp</span>
                        <Input id="discount_price" type="number" value={data.discount_price} onChange={(e) => setData('discount_price', e.target.value)} className="pl-11 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-emerald-200 dark:border-emerald-900/50 focus-visible:ring-emerald-500" />
                      </div>
                      {errors.discount_price && <p className="mt-1 text-sm text-emerald-500 font-medium">{errors.discount_price}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-sm font-semibold">Available Stock</Label>
                      <Input id="stock" type="number" value={data.stock} onChange={(e) => setData('stock', parseInt(e.target.value))} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 font-mono text-lg" />
                      {errors.stock && <p className="mt-1 text-sm text-red-500 font-medium">{errors.stock}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-8 py-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Package className="w-5 h-5 text-indigo-500" />
                    Physical Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="material" className="text-sm font-semibold">Material</Label>
                      <Input id="material" value={data.material} onChange={(e) => setData('material', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="Solid Oak..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dimensions" className="text-sm font-semibold">Dimensions (LxWxH)</Label>
                      <Input id="dimensions" value={data.dimensions} onChange={(e) => setData('dimensions', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="120x60x45cm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-sm font-semibold">Weight (kg)</Label>
                      <Input id="weight" type="number" step="0.01" value={data.weight} onChange={(e) => setData('weight', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="5.5" />
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
                    Product Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 bg-zinc-50 dark:bg-zinc-950/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer relative overflow-hidden">
                    {product?.image ? (
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm">
                        <SafeImage 
                          src={product.image.startsWith('http') ? product.image : `/storage/${product.image}`} 
                          alt={product.name} 
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
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Click to upload image</p>
                        <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max 2MB)</p>
                      </div>
                    )}
                    <Input id="image" type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                  {errors.image && <p className="text-sm text-red-500 font-medium text-center">{errors.image}</p>}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <Tags className="w-5 h-5 text-purple-500" />
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Category <span className="text-red-500">*</span></Label>
                    <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                      <SelectTrigger className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                        <SelectValue placeholder="Select best category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 z-[100] shadow-xl rounded-xl">
                        {categories.map((c) => <SelectItem key={c.id} value={c.id.toString()} className="hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer">{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.category_id && <p className="mt-1 text-sm text-red-500 font-medium">{errors.category_id}</p>}
                  </div>

                  <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Brand <span className="text-red-500">*</span></Label>
                    <Select value={data.brand_id} onValueChange={(v) => setData('brand_id', v)}>
                      <SelectTrigger className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                        <SelectValue placeholder="Select product brand" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 z-[100] shadow-xl rounded-xl">
                        {brands.map((b) => <SelectItem key={b.id} value={b.id.toString()} className="hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer">{b.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.brand_id && <p className="mt-1 text-sm text-red-500 font-medium">{errors.brand_id}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-b border-amber-100 dark:border-amber-900/30 px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-amber-600 dark:text-amber-500">
                    <Star className="w-5 h-5" />
                    Product Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <Checkbox id="is_bestseller" checked={data.is_bestseller} onCheckedChange={(v) => setData('is_bestseller', !!v)} className="mt-1 w-5 h-5 rounded-md data-[state=checked]:bg-amber-500 data-[state=checked]:border-none" />
                    <div>
                      <Label htmlFor="is_bestseller" className="text-base font-bold cursor-pointer">Bestseller Item</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Highlight this product in the bestseller sections across the storefront.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <Checkbox id="is_featured" checked={data.is_featured} onCheckedChange={(v) => setData('is_featured', !!v)} className="mt-1 w-5 h-5 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-none" />
                    <div>
                      <Label htmlFor="is_featured" className="text-base font-bold cursor-pointer">Featured Product</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Pin this product to the main hero section of the home page.</p>
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
