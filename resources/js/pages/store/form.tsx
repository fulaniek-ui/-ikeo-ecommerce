import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Info, MapPin, Clock, Phone, Navigation } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Store } from '@/types';

interface Props { store?: Store; }

export default function Form({ store }: Props) {
  const { data, setData, post, patch, errors, processing } = useForm({
    name: store?.name ?? '',
    address: store?.address ?? '',
    city: store?.city ?? '',
    phone: store?.phone ?? '',
    latitude: store?.latitude ?? '',
    longitude: store?.longitude ?? '',
    hours_id: store?.hours_id ?? '',
    hours_en: store?.hours_en ?? '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (store) {
 patch(`/dashboard/stores/${store.id}`); 
} else {
 post('/dashboard/stores'); 
}
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Stores', href: '/dashboard/stores' }, { title: store ? 'Edit Location' : 'New Location', href: '#' }]}>
      <Head title={store ? 'Edit Store Location' : 'Create Store Location'} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/stores" className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {store ? 'Edit Outlet' : 'Add New Outlet'}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                  {store ? 'Manage the coordinates and contact info for this showroom.' : 'Establish a new physical presence for your brand.'}
                </p>
              </div>
            </div>
            <Button disabled={processing} type="submit" size="lg" className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all h-12 px-8 font-bold">
              <Save className="w-5 h-5 mr-2" />
              {store ? 'Update Location' : 'Save Location'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-8">
              
              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-8 py-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Info className="w-5 h-5 text-orange-500" />
                    Essential Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Store/Showroom Name <span className="text-red-500">*</span></Label>
                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 font-bold" placeholder="e.g. IKEA Jakarta Garden City" />
                    {errors.name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-semibold">Full Address <span className="text-red-500">*</span></Label>
                    <Textarea id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} className="min-h-[100px] rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="Complete street address, floor, or building..." />
                    {errors.address && <p className="mt-1 text-sm text-red-500 font-medium">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold">City <span className="text-red-500">*</span></Label>
                      <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="Jakarta Timur" />
                      {errors.city && <p className="mt-1 text-sm text-red-500 font-medium">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold">Contact Phone <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="pl-11 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="+62 21..." />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-500 font-medium">{errors.phone}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-8 py-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    Opening Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="hours_en" className="text-sm font-semibold">Hours (English)</Label>
                      <Input id="hours_en" value={data.hours_en} onChange={(e) => setData('hours_en', e.target.value)} className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="Mon-Sat: 10AM - 9PM" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours_id" className="text-sm font-semibold">Hours (Indonesian)</Label>
                      <Input id="hours_id" value={data.hours_id} onChange={(e) => setData('hours_id', e.target.value)} className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-950" placeholder="Sen-Sab: 10:00 - 21:00" />
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column (Geo information) */}
            <div className="space-y-8">
              
              <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <Navigation className="w-5 h-5 text-blue-500" />
                    Geolocation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 text-center">
                  <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                    <div className="text-zinc-400 space-y-1">
                      <MapPin className="w-8 h-8 mx-auto opacity-50" />
                      <p className="text-xs">GPS Coordinates</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-left">
                    <div className="space-y-2">
                      <Label htmlFor="latitude" className="text-sm font-semibold">Latitude</Label>
                      <Input id="latitude" type="number" step="any" value={data.latitude} onChange={(e) => setData('latitude', e.target.value)} className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-950 font-mono" placeholder="-6.1754" />
                      {errors.latitude && <p className="mt-1 text-sm text-red-500 font-medium">{errors.latitude}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude" className="text-sm font-semibold">Longitude</Label>
                      <Input id="longitude" type="number" step="any" value={data.longitude} onChange={(e) => setData('longitude', e.target.value)} className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-950 font-mono" placeholder="106.8272" />
                      {errors.longitude && <p className="mt-1 text-sm text-red-500 font-medium">{errors.longitude}</p>}
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-zinc-500 leading-tight">
                    Coordinates are required to plot this location on the frontend Google Maps / Leaflet integration.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
