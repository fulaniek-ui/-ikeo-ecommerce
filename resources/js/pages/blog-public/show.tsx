import { Head } from '@inertiajs/react';
import { ArrowLeft, Calendar, User, Tag, Loader2, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface BlogDetail {
    id: number; title: string; title_id: string; slug: string;
    excerpt: string; content: string; content_id: string;
    category: string; image: string | null; published_at: string;
    author: { name: string } | null;
    tags: { tag: string; tag_id: string }[];
}

export default function BlogPublicShow() {
    const [blog, setBlog] = useState<BlogDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

    useEffect(() => {
        if (!slug) {
return;
}

        fetch(`/api/blogs/${slug}`)
            .then((r) => r.json())
            .then((json) => {
 setBlog(json.data || json); setLoading(false); 
})
            .catch(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <BookOpen className="h-16 w-16 text-muted-foreground/20" />
                <p className="text-lg font-medium">Article not found</p>
                <a href="/blog" className="text-amber-600 font-medium hover:underline">← Back to Blog</a>
            </div>
        );
    }

    return (
        <>
            <Head title={`${blog.title} — IKEO Blog`} />
            <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a]">
                {/* Header */}
                <header className="border-b bg-white/80 backdrop-blur-lg dark:bg-[#0a0a0a]/80">
                    <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
                        <a href="/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Back to Blog
                        </a>
                    </div>
                </header>

                {/* Hero image */}
                {blog.image && (
                    <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <article className="mx-auto max-w-3xl px-4 py-10">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <Badge className="bg-amber-100 text-amber-700 border-0 dark:bg-amber-900/30 dark:text-amber-400">{blog.category}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(blog.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        {blog.author && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />{blog.author.name}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">{blog.title}</h1>
                    {blog.title_id && (
                        <p className="mt-2 text-lg text-muted-foreground italic">{blog.title_id}</p>
                    )}

                    {/* Excerpt */}
                    {blog.excerpt && (
                        <p className="mt-6 text-lg text-muted-foreground leading-relaxed border-l-4 border-amber-500 pl-4">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Content */}
                    <div className="mt-8 prose prose-lg dark:prose-invert max-w-none">
                        <div className="text-base leading-relaxed whitespace-pre-line text-foreground/90">
                            {blog.content}
                        </div>
                    </div>

                    {/* Indonesian content */}
                    {blog.content_id && (
                        <div className="mt-10 border-t pt-8">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">🇮🇩 Versi Bahasa Indonesia</h3>
                            <div className="text-base leading-relaxed whitespace-pre-line text-foreground/80">
                                {blog.content_id}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {blog.tags.length > 0 && (
                        <div className="mt-10 border-t pt-6">
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((t, i) => (
                                    <Badge key={i} variant="outline" className="rounded-full px-3 py-1 text-xs gap-1">
                                        <Tag className="h-3 w-3" />{t.tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back */}
                    <div className="mt-12 text-center">
                        <a href="/blog" className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all">
                            <ArrowLeft className="h-4 w-4" /> Back to all articles
                        </a>
                    </div>
                </article>

                <footer className="border-t">
                    <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} IKEO. Scandinavian Furniture.
                    </div>
                </footer>
            </div>
        </>
    );
}
