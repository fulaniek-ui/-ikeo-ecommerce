import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Consultation } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props { consultation: Consultation; }

export default function Show({ consultation }: Props) {
  const { data, setData, patch, processing } = useForm({ status: consultation.status });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    patch(`/dashboard/consultations/${consultation.id}`);
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Consultations', href: '/dashboard/consultations' }, { title: consultation.name, href: '#' }]}>
      <Head title={`Consultation — ${consultation.name}`} />
      <div className="max-w-2xl p-5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{consultation.name}</h3>
          <Badge variant="outline">{consultation.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Email:</span> {consultation.email}</div>
          <div><span className="text-muted-foreground">Phone:</span> {consultation.phone}</div>
          <div><span className="text-muted-foreground">Date:</span> {new Date(consultation.preferred_date).toLocaleDateString('id-ID')}</div>
          <div><span className="text-muted-foreground">Store:</span> {consultation.store?.name ?? '-'}</div>
        </div>
        {consultation.message && <div className="text-sm"><span className="text-muted-foreground">Message:</span> {consultation.message}</div>}
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="space-y-2">
            <span className="text-sm font-medium">Update Status</span>
            <Select value={data.status} onValueChange={(v) => setData('status', v as Consultation['status'])}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button disabled={processing} type="submit">Update</Button>
        </form>
      </div>
    </AppLayout>
  );
}
