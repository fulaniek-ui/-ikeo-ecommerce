import { Head } from '@inertiajs/react';
import { Calendar, User, Tag, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PublicNav, PublicFooter } from '@/components/public-nav';
import { API } from '@/lib/api';

interface BlogDetail {
    id: number; title: string; title_id: string; slug: string;
    excerpt: string; content: string; content_id: string;
    category: string; image: string | null; published_at: string;
    author: { name: string } | null;
    tags: { tag: string; tag_id: string }[];
}
interface RelatedBlog {
    id: number; title: string; slug: string; category: string;
    image: string | null; published_at: string;
    tags: { tag: string }[];
}

export default function BlogPublicShow() {
    const [blog, setBlog] = useState<BlogDetail | null>(null);
    const [related, setRelated] = useState<RelatedBlog[]>([]);
    const [loading, setLoading] = useState(true);

    const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

    useEffect(() => {
        if (!slug) return;
        fetch(`${API}/blogs/${slug}`)
            .then((r) => r.json())
            .then((json) => {
                setBlog(json.data || json);
                setRelated(json.related || []);
                setLoading(false);
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
                <PublicNav />

                {/* Hero image */}
                {blog.image && (
                    <div className="w-full h-[250px] sm:h-[350px] lg:h-[420px] overflow-hidden">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="mx-auto max-w-7xl px-4 py-10">
                    <div className="grid gap-10 lg:grid-cols-3">
                        {/* ── Left: Article Content ── */}
                        <article className="lg:col-span-2">
                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-3 mb-5">
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

                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">{blog.title}</h1>
                            {blog.title_id && <p className="mt-2 text-lg text-muted-foreground italic">{blog.title_id}</p>}

                            {blog.excerpt && (
                                <p className="mt-6 text-lg text-muted-foreground leading-relaxed border-l-4 border-amber-500 pl-4">{blog.excerpt}</p>
                            )}

                            <div className="mt-8 text-base leading-[1.8] whitespace-pre-line text-foreground/90">{blog.content}</div>

                            {blog.content_id && (
                                <div className="mt-10 border-t pt-8">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">🇮🇩 Versi Bahasa Indonesia</h3>
                                    <div className="text-base leading-[1.8] whitespace-pre-line text-foreground/80">{blog.content_id}</div>
                                </div>
                            )}

                            {blog.tags.length > 0 && (
                                <div className="mt-10 border-t pt-6">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {blog.tags.map((t, i) => (
                                            <Badge key={i} variant="outline" className="rounded-full px-3 py-1 text-xs gap-1 hover:bg-amber-50 hover:border-amber-300 transition-colors">
                                                <Tag className="h-3 w-3" />{t.tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>

                        {/* ── Right: Related Articles Sidebar ── */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-20">
                                <Card className="border border-zinc-200 dark:border-zinc-800 shadow-md rounded-2xl overflow-hidden">
                                    {/* Box header */}
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4">
                                        <h3 className="text-white font-extrabold flex items-center gap-2">
                                            <BookOpen className="h-5 w-5" />
                                            Related Articles
                                        </h3>
                                        <p className="text-amber-100 text-xs mt-0.5">More articles you might enjoy</p>
                                    </div>

                                    <CardContent className="p-4">
                                        {related.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                                <p className="text-sm">No related articles found</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {related.map((item) => (
                                                    <a key={item.id} href={`/blog/${item.slug}`} className="group flex gap-3 p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                        {item.image ? (
                                                            <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden">
                                                                <img src={item.image} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                                                            </div>
                                                        ) : (
                                                            <div className="h-16 w-16 shrink-0 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                                <BookOpen className="h-5 w-5 text-zinc-300" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-xs leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors">{item.title}</h4>
                                                            <div className="flex items-center gap-2 mt-1.5">
                                                                <Badge variant="outline" className="text-[9px] rounded-full px-1.5 py-0">{item.category}</Badge>
                                                                <span className="text-[10px] text-muted-foreground">
                                                                    {new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                                </span>
                                                            </div>
                                                            {item.tags && item.tags.length > 0 && (
                                                                <div className="flex gap-1 mt-1">
                                                                    {item.tags.slice(0, 2).map((t, i) => (
                                                                        <span key={i} className="text-[9px] text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">{t.tag}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        <div className="border-t mt-4 pt-3">
                                            <a href="/blog" className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600 hover:gap-3 transition-all">
                                                View all articles <ArrowRight className="h-3.5 w-3.5" />
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </aside>
                    </div>
                </div>

                <PublicFooter />
            </div>
        </>
    );
}
