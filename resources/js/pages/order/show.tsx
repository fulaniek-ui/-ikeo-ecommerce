import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Order } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

const formatIDR = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

interface Props { order: Order; }

export default function Show({ order: initialOrder }: Props) {
  const [order, setOrder] = useState(initialOrder);
  const [checking, setChecking] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState('');
  const { data, setData, patch, processing } = useForm({ status: order.status });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    patch(`/dashboard/orders/${order.id}`);
  };

  const checkPayment = async () => {
    setChecking(true);
    setPaymentMsg('');
    try {
      const res = await fetch(`/api/payments/${order.id}/check`);
      const json = await res.json();
      setPaymentMsg(json.message);
      if (json.data) {
        setOrder(json.data);
        setData('status', json.data.status);
      }
    } catch {
      setPaymentMsg('Failed to check payment status');
    }
    setChecking(false);
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Orders', href: '/dashboard/orders' }, { title: order.order_number, href: '#' }]}>
      <Head title={`Order ${order.order_number}`} />
      <div className="max-w-3xl p-5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Order {order.order_number}</h3>
          <Badge variant="outline">{order.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Customer:</span> {order.user?.name}</div>
          <div><span className="text-muted-foreground">Courier:</span> {order.courier}</div>
          <div><span className="text-muted-foreground">Payment:</span> {order.payment_method}</div>
          <div><span className="text-muted-foreground">Paid:</span> {order.paid_at ? new Date(order.paid_at).toLocaleString('id-ID') : <Badge variant="destructive">Unpaid</Badge>}</div>
          <div><span className="text-muted-foreground">Date:</span> {new Date(order.created_at).toLocaleDateString('id-ID')}</div>
          {order.payment_url && !order.paid_at && (
            <div><a href={order.payment_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">Open Payment Link ↗</a></div>
          )}
        </div>

        {order.xendit_invoice_id && !order.paid_at && (
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={checkPayment} disabled={checking}>
              {checking ? 'Checking...' : '🔄 Check Payment Status'}
            </Button>
            {paymentMsg && (
              <span className={`text-sm font-medium ${paymentMsg.includes('confirmed') ? 'text-green-600' : paymentMsg.includes('Waiting') ? 'text-amber-600' : 'text-red-600'}`}>
                {paymentMsg}
              </span>
            )}
          </div>
        )}

        {order.paid_at && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300">
            ✅ Payment confirmed at {new Date(order.paid_at).toLocaleString('id-ID')}
          </div>
        )}

        {order.address && (
          <div className="text-sm">
            <span className="text-muted-foreground">Ship to:</span> {order.address.recipient_name}, {order.address.address}, {order.address.city}, {order.address.province} {order.address.postal_code}
          </div>
        )}
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50"><th className="p-3 text-left">Product</th><th className="p-3 text-left">Variant</th><th className="p-3 text-right">Price</th><th className="p-3 text-right">Qty</th><th className="p-3 text-right">Subtotal</th></tr></thead>
            <tbody>
              {order.order_items?.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.product_name}</td>
                  <td className="p-3">{item.variant_name ?? '-'}</td>
                  <td className="p-3 text-right">{formatIDR(item.price)}</td>
                  <td className="p-3 text-right">{item.quantity}</td>
                  <td className="p-3 text-right">{formatIDR(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-sm space-y-1 text-right">
          <div>Subtotal: {formatIDR(order.subtotal)}</div>
          <div>Shipping: {formatIDR(order.shipping_cost)}</div>
          <div>Tax: {formatIDR(order.tax)}</div>
          <div className="font-bold text-base">Total: {formatIDR(order.total)}</div>
        </div>
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="space-y-2">
            <span className="text-sm font-medium">Update Status</span>
            <Select value={data.status} onValueChange={(v) => setData('status', v as Order['status'])}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button disabled={processing} type="submit">Update</Button>
        </form>
      </div>
    </AppLayout>
  );
}
