import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Store } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

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
    if (store) { patch(`/dashboard/stores/${store.id}`); }
    else { post('/dashboard/stores'); }
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Stores', href: '/dashboard/stores' }, { title: store ? 'Update' : 'Create', href: '#' }]}>
      <Head title={store ? 'Update Store' : 'Create Store'} />
      <div className="max-w-2xl p-5">
        <div>
          <h3 className="text-lg font-medium">{store ? 'Update' : 'Create'} Store</h3>
          <Separator className="mt-5" />
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            {errors.name && <p className="mt-1 text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
            {errors.address && <p className="mt-1 text-red-500">{errors.address}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} />
              {errors.city && <p className="mt-1 text-red-500">{errors.city}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
              {errors.phone && <p className="mt-1 text-red-500">{errors.phone}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" type="number" step="any" value={data.latitude} onChange={(e) => setData('latitude', e.target.value)} />
              {errors.latitude && <p className="mt-1 text-red-500">{errors.latitude}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" type="number" step="any" value={data.longitude} onChange={(e) => setData('longitude', e.target.value)} />
              {errors.longitude && <p className="mt-1 text-red-500">{errors.longitude}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours_en">Hours (EN)</Label>
              <Input id="hours_en" value={data.hours_en} onChange={(e) => setData('hours_en', e.target.value)} placeholder="Mon-Sat: 10AM-9PM" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours_id">Hours (ID)</Label>
              <Input id="hours_id" value={data.hours_id} onChange={(e) => setData('hours_id', e.target.value)} placeholder="Sen-Sab: 10.00-21.00" />
            </div>
          </div>
          <Button disabled={processing} type="submit">{store ? 'Update' : 'Submit'}</Button>
        </form>
      </div>
    </AppLayout>
  );
}
