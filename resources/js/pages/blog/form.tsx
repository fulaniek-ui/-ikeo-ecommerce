import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Blog } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

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
    <AppLayout breadcrumbs={[{ title: 'Blogs', href: '/dashboard/blogs' }, { title: blog ? 'Update' : 'Create', href: '#' }]}>
      <Head title={blog ? 'Update Blog' : 'Create Blog'} />
      <div className="max-w-2xl p-5">
        <div>
          <h3 className="text-lg font-medium">{blog ? 'Update' : 'Create'} Blog</h3>
          <Separator className="mt-5" />
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (EN)</Label>
              <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
              {errors.title && <p className="mt-1 text-red-500">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_id">Title (ID)</Label>
              <Input id="title_id" value={data.title_id} onChange={(e) => setData('title_id', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category (EN)</Label>
              <Input id="category" value={data.category} onChange={(e) => setData('category', e.target.value)} />
              {errors.category && <p className="mt-1 text-red-500">{errors.category}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id_text">Category (ID)</Label>
              <Input id="category_id_text" value={data.category_id_text} onChange={(e) => setData('category_id_text', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt (EN)</Label>
            <Textarea id="excerpt" value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content (EN)</Label>
            <Textarea id="content" rows={6} value={data.content} onChange={(e) => setData('content', e.target.value)} />
            {errors.content && <p className="mt-1 text-red-500">{errors.content}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content_id">Content (ID)</Label>
            <Textarea id="content_id" rows={6} value={data.content_id} onChange={(e) => setData('content_id', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="published_at">Publish Date</Label>
              <Input id="published_at" type="date" value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              {blog?.image && <img src={blog.image.startsWith('http') ? blog.image : `/storage/${blog.image}`} alt="" className="h-20 w-20 rounded-md object-cover" />}
              <Input id="image" type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} />
            </div>
          </div>
          <Button disabled={processing} type="submit">{blog ? 'Update' : 'Submit'}</Button>
        </form>
      </div>
    </AppLayout>
  );
}
