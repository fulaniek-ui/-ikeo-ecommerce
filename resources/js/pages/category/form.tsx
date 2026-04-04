import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Image as ImageIcon, Sparkles } from 'lucide-react';
import type { FormEvent } from 'react';
import { SafeImage } from '@/components/safe-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Category } from '@/types';

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
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/categories" className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {category ? 'Edit Category' : 'Create New Category'}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                  {category ? 'Update the details for this category.' : 'Define a new organizational category for your items.'}
                </p>
              </div>
            </div>
            <Button disabled={processing} type="submit" size="lg" className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all h-12 px-8 font-bold">
              <Save className="w-5 h-5 mr-2" />
              {category ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Main Information) */}
            <div className="lg:col-span-2 space-y-8">
              
              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-8 py-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Info className="w-5 h-5 text-emerald-500" />
                    General Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">Name (English) <span className="text-red-500">*</span></Label>
                      <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="e.g. Living Room Furniture" />
                      {errors.name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name_id" className="text-sm font-semibold">Name (Indonesian) <span className="text-red-500">*</span></Label>
                      <Input id="name_id" value={data.name_id} onChange={(e) => setData('name_id', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="e.g. Furnitur Ruang Tamu" />
                      {errors.name_id && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name_id}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold">Description (English)</Label>
                    <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="min-h-[120px] rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="Describe this category briefly..." />
                    {errors.description && <p className="mt-1 text-sm text-red-500 font-medium">{errors.description}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_id" className="text-sm font-semibold">Description (Indonesian)</Label>
                    <Textarea id="description_id" value={data.description_id} onChange={(e) => setData('description_id', e.target.value)} className="min-h-[120px] rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="Jelaskan kategori ini secara singkat..." />
                    {errors.description_id && <p className="mt-1 text-sm text-red-500 font-medium">{errors.description_id}</p>}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column (Sidebar Information) */}
            <div className="space-y-8">
              
              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Visuals
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  
                  <div className="space-y-2">
                    <Label htmlFor="icon" className="text-sm font-semibold">Category Icon</Label>
                    <Input id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="e.g. sofa, bed, lamp" />
                    <p className="text-xs text-muted-foreground">Enter an icon identifier to be used on the frontend navigation.</p>
                    {errors.icon && <p className="mt-1 text-sm text-red-500 font-medium">{errors.icon}</p>}
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="image" className="text-sm font-semibold mb-2 block">Cover Image</Label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 bg-zinc-50 dark:bg-zinc-950/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer relative overflow-hidden">
                      {category?.image ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm">
                          <SafeImage 
                            src={category.image.startsWith('http') ? category.image : `/storage/${category.image}`} 
                            alt={category.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-medium shadow-sm">Click to change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Upload Header Image</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG or GIF (max 2MB)</p>
                        </div>
                      )}
                      <Input id="image" type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                    {errors.image && <p className="text-sm text-red-500 font-medium text-center">{errors.image}</p>}
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
