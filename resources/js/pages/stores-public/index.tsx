import { Head } from '@inertiajs/react';
import { MapPin, Phone, Clock, Navigation, Loader2, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PublicNav, PublicFooter } from '@/components/public-nav';
import { API } from '@/lib/api';

interface StoreItem {
    id: number; name: string; address: string; city: string;
    phone: string; latitude: string; longitude: string;
    hours_id: string; hours_en: string;
}

export default function StoresPublicIndex() {
    const [stores, setStores] = useState<StoreItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/stores`)
            .then((r) => r.json())
            .then((json) => { setStores(json.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            <Head title="Store Locations — IKEO" />
            <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a]">
                <PublicNav />

                <div className="mx-auto max-w-7xl px-4 py-12">
                    <div className="text-center mb-12">
                        <p className="text-sm font-medium uppercase tracking-widest text-amber-600 mb-3">Visit Us</p>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Our Store Locations</h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Experience IKEO furniture in person. Visit our showrooms across Indonesia for the full shopping experience.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {stores.map((store) => (
                                <Card key={store.id} className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                                    {/* Map placeholder */}
                                    <div className="h-40 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute top-4 left-4 h-20 w-20 rounded-full border-2 border-blue-300" />
                                            <div className="absolute bottom-2 right-6 h-16 w-16 rounded-full border-2 border-cyan-300" />
                                            <div className="absolute top-8 right-12 h-8 w-8 rounded-full bg-blue-200" />
                                        </div>
                                        <div className="relative flex flex-col items-center gap-2">
                                            <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                                                <MapPin className="h-6 w-6 text-white" />
                                            </div>
                                            <Badge className="bg-white/90 text-zinc-700 border-0 shadow-sm text-xs font-bold dark:bg-zinc-900/90 dark:text-zinc-300">
                                                {store.city}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-5 space-y-4">
                                        <div>
                                            <h3 className="font-extrabold text-lg">{store.name}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{store.address}</p>
                                        </div>

                                        <div className="space-y-2.5">
                                            <div className="flex items-center gap-2.5 text-sm">
                                                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                                                <span>{store.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-sm">
                                                <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                                                <span>{store.hours_en || store.hours_id}</span>
                                            </div>
                                        </div>

                                        <a
                                            href={`https://www.google.com/maps?q=${store.latitude},${store.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="outline" className="w-full rounded-xl gap-2 mt-2 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors">
                                                <Navigation className="h-4 w-4" /> Get Directions
                                            </Button>
                                        </a>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* CTA */}
                    <div className="mt-16 text-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-10 text-white">
                        <Store className="h-10 w-10 mx-auto mb-4 opacity-80" />
                        <h2 className="text-2xl font-extrabold">Need Help Choosing?</h2>
                        <p className="mt-2 text-amber-100 max-w-md mx-auto">Book a free design consultation with our interior experts at any IKEO showroom.</p>
                        <a href="/consultation">
                            <Button className="mt-6 bg-white text-amber-600 hover:bg-amber-50 font-bold rounded-xl px-8">
                                Book Consultation
                            </Button>
                        </a>
                    </div>
                </div>

                <PublicFooter />
            </div>
        </>
    );
}
