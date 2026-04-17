import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navLinks = [
    { href: '/catalog', label: 'Products' },
    { href: '/blog', label: 'Blog' },
    { href: '/stores', label: 'Stores' },
    { href: '/consultation', label: 'Consultation' },
];

export function PublicNav() {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const path = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/80 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-[#0a0a0a]/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
                <a href="/" className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-black text-sm shadow-md shadow-amber-500/20">IK</div>
                    <span className="text-xl font-extrabold tracking-tight">IKEO</span>
                </a>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${path.startsWith(link.href) ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'}`}>
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {auth.user ? (
                        <Link href="/dashboard" className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow-md shadow-amber-500/20 hover:shadow-lg transition-all">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:block rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">Log in</Link>
                            <Link href="/register" className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow-md shadow-amber-500/20 hover:shadow-lg transition-all">Register</Link>
                        </>
                    )}
                    <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={() => setOpen(!open)}>
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile nav */}
            {open && (
                <div className="md:hidden border-t bg-white dark:bg-[#0a0a0a] px-4 py-3 space-y-1">
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href}
                            className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${path.startsWith(link.href) ? 'bg-amber-50 text-amber-700' : 'text-zinc-600 hover:bg-zinc-100'}`}>
                            {link.label}
                        </a>
                    ))}
                </div>
            )}
        </header>
    );
}

export function PublicFooter() {
    return (
        <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold text-xs">IK</div>
                            <span className="text-lg font-extrabold">IKEO</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Scandinavian furniture crafted with natural materials for modern living.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-3">Shop</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <a href="/catalog" className="block hover:text-foreground transition-colors">All Products</a>
                            <a href="/catalog?bestseller=1" className="block hover:text-foreground transition-colors">Bestsellers</a>
                            <a href="/catalog?featured=1" className="block hover:text-foreground transition-colors">Featured</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-3">Company</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <a href="/blog" className="block hover:text-foreground transition-colors">Blog</a>
                            <a href="/stores" className="block hover:text-foreground transition-colors">Store Locations</a>
                            <a href="/consultation" className="block hover:text-foreground transition-colors">Consultation</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-3">Support</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>Email: hello@ikeo.com</p>
                            <p>Phone: +62 21 2937 8000</p>
                            <p>Mon-Sun: 10AM - 10PM</p>
                        </div>
                    </div>
                </div>
                <div className="border-t pt-6 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} IKEO. Scandinavian Furniture — Final Project Bootcamp.
                </div>
            </div>
        </footer>
    );
}
