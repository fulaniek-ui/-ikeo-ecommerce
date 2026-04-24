import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Image as ImageIcon, Award } from 'lucide-react';
import type { FormEvent } from 'react';
import { SafeImage } from '@/components/safe-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Brand } from '@/types';

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
      
      <div className="mx-auto p-6 sm:p-8 lg:p-10">
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Header Action Bar */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Link href="/dashboard/brands" className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/20">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {brand ? 'Edit Brand' : 'Register New Brand'}
                  </h1>
                  <p className="text-blue-100/70 mt-0.5 text-sm">
                    {brand ? 'Maintain the brand identity and details.' : 'Establish a new brand partnership for your catalog.'}
                  </p>
                </div>
              </div>
              <Button disabled={processing} type="submit" size="lg" className="rounded-xl bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all h-12 px-8 font-bold">
                <Save className="w-5 h-5 mr-2" />
                {brand ? 'Save Changes' : 'Create Brand'}
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
                    Brand Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Brand Name <span className="text-red-500">*</span></Label>
                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="e.g. IKEA, Herman Miller" />
                    {errors.name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold">About the Brand</Label>
                    <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="min-h-[160px] rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="Write a short biography or mission statement for this brand..." />
                    {errors.description && <p className="mt-1 text-sm text-red-500 font-medium">{errors.description}</p>}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column (Sidebar Information) */}
            <div className="space-y-8">
              
              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <Award className="w-5 h-5 text-amber-500" />
                    Brand Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  
                  <div className="space-y-2">
                    <Label htmlFor="logo" className="text-sm font-semibold mb-2 block">Brand Logo</Label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 bg-zinc-50 dark:bg-zinc-950/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer relative overflow-hidden aspect-square">
                      {brand?.logo ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden bg-white flex items-center justify-center p-4">
                          <SafeImage 
                            src={brand.logo.startsWith('http') ? brand.logo : `/storage/${brand.logo}`} 
                            alt={brand.name} 
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-medium shadow-sm text-sm">Update Logo</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mx-auto mb-3">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Upload Official Logo</p>
                          <p className="text-xs text-muted-foreground mt-1">Prefer transparent PNG or SVG</p>
                        </div>
                      )}
                      <Input id="logo" type="file" accept="image/*" onChange={(e) => setData('logo', e.target.files?.[0] ?? null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                    {errors.logo && <p className="text-sm text-red-500 font-medium text-center mt-2">{errors.logo}</p>}
                  </div>

                </CardContent>
              </Card>

              <div className="p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-zinc-400" />
                  Quick Tip
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  High-quality logos with transparent backgrounds perform best on the storefront and product badges.
                </p>
              </div>

            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
