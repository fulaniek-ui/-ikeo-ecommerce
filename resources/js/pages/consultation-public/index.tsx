import { Head } from '@inertiajs/react';
import { MessageSquare, Loader2, CheckCircle, MapPin, Calendar, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StoreItem { id: number; name: string; city: string; }

export default function ConsultationPublicIndex() {
    const [stores, setStores] = useState<StoreItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [form, setForm] = useState({ store_id: '', name: '', email: '', phone: '', preferred_date: '', message: '' });

    useEffect(() => {
        fetch('/api/stores')
            .then((r) => r.json())
            .then((json) => { setStores(json.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const res = await fetch('/api/consultations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ ...form, store_id: form.store_id ? Number(form.store_id) : null }),
        });

        const json = await res.json();
        setSubmitting(false);

        if (res.ok) {
            setSuccess(true);
            setForm({ store_id: '', name: '', email: '', phone: '', preferred_date: '', message: '' });
        } else {
            setErrors(json.errors || {});
        }
    };

    const fieldError = (field: string) => errors[field]?.[0];

    return (
        <>
            <Head title="Book Consultation — IKEO" />
            <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a]">
                <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg dark:bg-[#0a0a0a]/80">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                        <a href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-xs">IK</div>
                            <span className="text-lg font-bold">IKEO</span>
                        </a>
                        <nav className="flex items-center gap-4 text-sm font-medium">
                            <a href="/catalog" className="hover:text-amber-600 transition-colors">Products</a>
                            <a href="/blog" className="hover:text-amber-600 transition-colors">Blog</a>
                            <a href="/stores" className="hover:text-amber-600 transition-colors">Stores</a>
                            <a href="/consultation" className="text-amber-600 font-semibold">Consultation</a>
                        </nav>
                    </div>
                </header>

                <div className="mx-auto max-w-3xl px-4 py-12">
                    <div className="text-center mb-10">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
                            <MessageSquare className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Book a Free Consultation</h1>
                        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                            Our interior design experts will help you choose the perfect furniture for your space. Visit any IKEO showroom for a personalized experience.
                        </p>
                    </div>

                    {success ? (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-extrabold">Booking Confirmed!</h2>
                                <p className="mt-2 text-muted-foreground max-w-sm">
                                    Thank you! We've received your consultation request. Our team will contact you shortly to confirm the appointment.
                                </p>
                                <div className="flex gap-3 mt-6">
                                    <Button variant="outline" className="rounded-xl" onClick={() => setSuccess(false)}>Book Another</Button>
                                    <a href="/"><Button className="rounded-xl bg-amber-500 hover:bg-amber-600">Back to Home</Button></a>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6 sm:p-8">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="font-semibold">Full Name *</Label>
                                                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="h-11 rounded-xl" required />
                                                {fieldError('name') && <p className="text-sm text-red-500">{fieldError('name')}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="font-semibold">Email *</Label>
                                                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" className="h-11 rounded-xl" required />
                                                {fieldError('email') && <p className="text-sm text-red-500">{fieldError('email')}</p>}
                                            </div>
                                        </div>

                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="font-semibold">Phone Number *</Label>
                                                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08xxxxxxxxxx" className="h-11 rounded-xl" required />
                                                {fieldError('phone') && <p className="text-sm text-red-500">{fieldError('phone')}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="date" className="font-semibold">Preferred Date *</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input id="date" type="date" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
                                                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                                        className="h-11 rounded-xl pl-10" required />
                                                </div>
                                                {fieldError('preferred_date') && <p className="text-sm text-red-500">{fieldError('preferred_date')}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="font-semibold">Preferred Store Location</Label>
                                            <Select value={form.store_id} onValueChange={(v) => setForm({ ...form, store_id: v })}>
                                                <SelectTrigger className="h-11 rounded-xl">
                                                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                                                    <SelectValue placeholder="Select a showroom (optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {stores.map((s) => (
                                                        <SelectItem key={s.id} value={s.id.toString()}>{s.name} — {s.city}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="font-semibold">What do you need help with?</Label>
                                            <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                placeholder="Tell us about your space, style preferences, budget, or any specific furniture you're looking for..."
                                                className="min-h-[120px] rounded-xl" />
                                        </div>

                                        <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold shadow-lg shadow-indigo-500/20 gap-2">
                                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                            {submitting ? 'Submitting...' : 'Book Consultation'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <footer className="border-t mt-12">
                    <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} IKEO. Scandinavian Furniture.
                    </div>
                </footer>
            </div>
        </>
    );
}
