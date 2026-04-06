import { Head, Link, usePage } from '@inertiajs/react';
import { Armchair, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="IKEO — Scandinavian Furniture" />
            <div className="min-h-screen bg-[#FAFAF8] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-sm">IK</div>
                        <span className="text-xl font-bold tracking-wide">IKEO</span>
                    </div>
                    <nav className="flex items-center gap-3">
                        <Link href="/catalog" className="rounded-lg px-5 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                            Shop
                        </Link>
                        {auth.user ? (
                            <Link href={dashboard()} className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} className="rounded-lg px-5 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link href={register()} className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors">
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto max-w-6xl px-6">
                    <section className="py-20 text-center">
                        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-amber-600 dark:text-amber-400">Scandinavian Design</p>
                        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                            Furniture that feels
                            <br />
                            <span className="text-amber-500">like home</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#706f6c] dark:text-[#A1A09A]">
                            Discover minimalist Scandinavian furniture crafted with natural materials.
                            Simple, functional, and beautifully designed for modern living.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-4">
                            <Link href="/catalog" className="rounded-xl bg-[#1b1b18] px-8 py-3.5 text-sm font-semibold text-white hover:bg-black transition-colors dark:bg-white dark:text-black dark:hover:bg-[#e5e5e5]">
                                Shop Now
                            </Link>
                            <a href="#features" className="rounded-xl border border-[#e3e3e0] px-8 py-3.5 text-sm font-semibold hover:border-[#c5c5c0] transition-colors dark:border-[#3E3E3A] dark:hover:border-[#62605b]">
                                Learn More
                            </a>
                        </div>
                    </section>

                    <section id="features" className="grid gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: Armchair, title: 'Premium Quality', desc: 'Crafted from solid oak, birch, and sustainable materials' },
                            { icon: Truck, title: 'Fast Delivery', desc: 'JNE, GoSend, SiCepat — delivered to your doorstep' },
                            { icon: ShieldCheck, title: 'Secure Payment', desc: 'Bank transfer & e-wallet with order tracking' },
                            { icon: Headphones, title: 'Design Consultation', desc: 'Book a free session with our interior experts' },
                        ].map((f, i) => (
                            <div key={i} className="rounded-2xl border border-[#e3e3e0] bg-white p-6 transition-shadow hover:shadow-lg dark:border-[#3E3E3A] dark:bg-[#161615]">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10">
                                    <f.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="mb-1 font-semibold">{f.title}</h3>
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">{f.desc}</p>
                            </div>
                        ))}
                    </section>
                </main>

                <footer className="border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                    <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        © {new Date().getFullYear()} IKEO. Scandinavian Furniture — Final Project Bootcamp.
                    </div>
                </footer>
            </div>
        </>
    );
}
