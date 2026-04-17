import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Image as ImageIcon, BookOpen, Clock, Tags } from 'lucide-react';
import type { FormEvent } from 'react';
import { SafeImage } from '@/components/safe-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Blog } from '@/types';

interface Props { blog?: Blog; }

export default function Form({ blog }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    title: blog?.title ?? '',
    title_id: blog?.title_id ?? '',
    excerpt: blog?.excerpt ?? '',
    excerpt_id: blog?.excerpt_id ?? '',
    content: blog?.content ?? '',
    content_id: blog?.content_id ?? '',
    category: blog?.category ?? '',
    category_id_text: blog?.category_id_text ?? '',
    published_at: blog?.published_at?.slice(0, 10) ?? '',
    image: null as File | null,
    _method: blog ? 'PATCH' : 'POST',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const url = blog ? `/dashboard/blogs/${blog.id}` : '/dashboard/blogs';
    post(url, { forceFormData: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Blog', href: '/dashboard/blogs' }, { title: blog ? 'Edit Article' : 'New Article', href: '#' }]}>
      <Head title={blog ? 'Edit Blog Article' : 'Create Blog Article'} />
      
      <div className="mx-auto p-6 sm:p-8 lg:p-10">
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/blogs" className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {blog ? 'Edit Article' : 'Create New Article'}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                  {blog ? 'Refine your content for publication.' : 'Share your latest news and updates with your audience.'}
                </p>
              </div>
            </div>
            <Button disabled={processing} type="submit" size="lg" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-all h-12 px-8 font-bold">
              <Save className="w-5 h-5 mr-2" />
              {blog ? 'Save Content' : 'Publish Article'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-8">
              
              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-8 py-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    English Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold">Article Title <span className="text-red-500">*</span></Label>
                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 font-bold" placeholder="e.g. 5 Tips for a Cozy Living Room" />
                    {errors.title && <p className="mt-1 text-sm text-red-500 font-medium">{errors.title}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-sm font-semibold">Short Excerpt</Label>
                    <Textarea id="excerpt" value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} className="min-h-[80px] rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-sm" placeholder="A brief summary for previews..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-semibold">Main Body Content <span className="text-red-500">*</span></Label>
                    <Textarea id="content" rows={12} value={data.content} onChange={(e) => setData('content', e.target.value)} className="rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 leading-relaxed" placeholder="Write your full article here..." />
                    {errors.content && <p className="mt-1 text-sm text-red-500 font-medium">{errors.content}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-8 py-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <BookOpen className="w-5 h-5 text-zinc-500" />
                    Indonesian Content (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title_id" className="text-sm font-semibold text-zinc-500">Judul Artikel</Label>
                    <Input id="title_id" value={data.title_id} onChange={(e) => setData('title_id', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 font-bold" placeholder="e.g. 5 Tips untuk Ruang Tamu Nyaman" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="excerpt_id" className="text-sm font-semibold text-zinc-500">Ringkasan Singkat</Label>
                    <Textarea id="excerpt_id" value={data.excerpt_id} onChange={(e) => setData('excerpt_id', e.target.value)} className="min-h-[80px] rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-sm" placeholder="Ringkasan singkat untuk pratinjau..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content_id" className="text-sm font-semibold text-zinc-500">Isi Konten Utama</Label>
                    <Textarea id="content_id" rows={12} value={data.content_id} onChange={(e) => setData('content_id', e.target.value)} className="rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 leading-relaxed" placeholder="Tulis artikel lengkap di sini..." />
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column (Meta information) */}
            <div className="space-y-8">
              
              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <ImageIcon className="w-5 h-5 text-rose-500" />
                    Cover Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 bg-zinc-50 dark:bg-zinc-950/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer relative overflow-hidden aspect-video">
                    {blog?.image ? (
                      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm">
                        <SafeImage 
                          src={blog.image.startsWith('http') ? blog.image : `/storage/${blog.image}`} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-medium shadow-sm">Change Cover</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center mx-auto mb-3">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Upload Cover Photo</p>
                        <p className="text-xs text-muted-foreground mt-1 text-center px-4">Landscape (16:9) performs best for blog headers.</p>
                      </div>
                    )}
                    <Input id="image" type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                  {errors.image && <p className="text-sm text-red-500 font-medium text-center mt-2">{errors.image}</p>}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <Tags className="w-5 h-5 text-indigo-500" />
                    Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold">Category (EN) <span className="text-red-500">*</span></Label>
                    <Input id="category" value={data.category} onChange={(e) => setData('category', e.target.value)} className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="e.g. Interior Design" />
                    {errors.category && <p className="mt-1 text-sm text-red-500 font-medium">{errors.category}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category_id_text" className="text-sm font-semibold">Category (ID)</Label>
                    <Input id="category_id_text" value={data.category_id_text} onChange={(e) => setData('category_id_text', e.target.value)} className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="e.g. Desain Interior" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 overflow-hidden">
                <CardHeader className="border-b border-white/40 dark:border-black/10 px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-purple-600 dark:text-purple-400">
                    <Clock className="w-5 h-5" />
                    Publishing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label htmlFor="published_at" className="text-sm font-semibold">Set Publish Date</Label>
                    <Input id="published_at" type="date" value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} className="h-11 rounded-xl bg-white/80 dark:bg-zinc-950/80 border-purple-100 dark:border-purple-900/30" />
                    <p className="text-xs text-purple-500 dark:text-purple-400 mt-2 font-medium">Leave empty to keep as a private draft.</p>
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
