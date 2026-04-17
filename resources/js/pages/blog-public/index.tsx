import { Head } from '@inertiajs/react';
import { Loader2, BookOpen, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PublicNav, PublicFooter } from '@/components/public-nav';

interface BlogItem {
    id: number; title: string; slug: string; excerpt: string;
    category: string; image: string | null; published_at: string;
    author: { name: string } | null;
    tags: { tag: string }[];
}

export default function BlogPublicIndex() {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blogs')
            .then((r) => r.json())
            .then((json) => {
 setBlogs(json.data); setLoading(false); 
})
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            <Head title="Blog — IKEO" />
            <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a]">
                <PublicNav />

                <div className="mx-auto max-w-7xl px-4 py-12">
                    {/* Hero */}
                    <div className="text-center mb-12">
                        <p className="text-sm font-medium uppercase tracking-widest text-amber-600 mb-3">IKEO Journal</p>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Design Inspiration & Tips</h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Discover ideas, guides, and trends to transform your living space into something extraordinary.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No articles yet</p>
                        </div>
                    ) : (
                        <>
                            {/* Featured (first article) */}
                            <a href={`/blog/${blogs[0].slug}`} className="group block mb-12">
                                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                                    <div className="grid md:grid-cols-2">
                                        <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-muted/30">
                                            {blogs[0].image ? (
                                                <img src={blogs[0].image} alt={blogs[0].title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="flex h-full items-center justify-center"><BookOpen className="h-16 w-16 text-muted-foreground/20" /></div>
                                            )}
                                        </div>
                                        <CardContent className="flex flex-col justify-center p-8 md:p-12">
                                            <Badge className="w-fit mb-4 bg-amber-100 text-amber-700 border-0 dark:bg-amber-900/30 dark:text-amber-400">{blogs[0].category}</Badge>
                                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight group-hover:text-amber-600 transition-colors">{blogs[0].title}</h2>
                                            <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-3">{blogs[0].excerpt}</p>
                                            <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
                                                {blogs[0].author && (
                                                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{blogs[0].author.name}</span>
                                                )}
                                                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(blogs[0].published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                            <div className="mt-6 flex items-center gap-2 text-amber-600 font-semibold text-sm group-hover:gap-3 transition-all">
                                                Read Article <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            </a>

                            {/* Grid */}
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {blogs.slice(1).map((blog) => (
                                    <a key={blog.id} href={`/blog/${blog.slug}`} className="group">
                                        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                                            <div className="aspect-[16/10] overflow-hidden bg-muted/30">
                                                {blog.image ? (
                                                    <img src={blog.image} alt={blog.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center"><BookOpen className="h-10 w-10 text-muted-foreground/20" /></div>
                                                )}
                                            </div>
                                            <CardContent className="p-5">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Badge variant="outline" className="text-[10px] rounded-full px-2">{blog.category}</Badge>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-2.5 w-2.5" />
                                                        {new Date(blog.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors">{blog.title}</h3>
                                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                                                {blog.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-3">
                                                        {blog.tags.slice(0, 3).map((t, i) => (
                                                            <span key={i} className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                                                <Tag className="h-2.5 w-2.5" />{t.tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <PublicFooter />
            </div>
        </>
    );
}
