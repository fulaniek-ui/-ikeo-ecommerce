import { Head, useForm, Link } from '@inertiajs/react';
import { Package, Truck, User, MapPin, CreditCard, Calendar, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Receipt } from 'lucide-react';
import type { FormEvent} from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { Order } from '@/types';

const formatIDR = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const imgSrc = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `/storage/${path}`;
};

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200',
};

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
      
      <div className="max-w-5xl mx-auto p-6 sm:p-8 lg:p-10 space-y-8">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)' }}>
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-500/5" />
          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/orders" className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Order {order.order_number}
                  </h2>
                  <Badge className={`px-3 py-1 text-sm font-semibold border ${statusColor[order.status] || ''}`}>
                    {capitalize(order.status)}
                  </Badge>
                </div>
                <p className="text-blue-200/50 text-sm mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Placed on {new Date(order.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex bg-white/10 backdrop-blur-sm p-2 rounded-2xl border border-white/10 items-center gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm font-medium text-muted-foreground ml-2 hidden sm:inline-block">Status:</span>
              <div className="w-[180px]">
                <Select value={data.status} onValueChange={(v) => setData('status', v as Order['status'])}>
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs focus:ring-amber-500 rounded-xl h-10">
                    <SelectValue placeholder="Update status..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl z-[1000] min-w-[200px] overflow-hidden">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                      <SelectItem key={s} value={s} className="cursor-pointer py-2.5 px-3 focus:bg-amber-50 dark:focus:bg-amber-900/20 focus:text-amber-700 dark:focus:text-amber-400 m-1 rounded-lg font-medium transition-colors">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${s === 'delivered' ? 'bg-green-500' : s === 'cancelled' ? 'bg-red-500' : s === 'shipped' ? 'bg-purple-500' : s === 'processing' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                          {capitalize(s)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button disabled={processing} type="submit" size="sm" className="rounded-xl h-10 px-5 bg-white text-zinc-900 hover:bg-zinc-100 shadow-md transition-all font-bold">
                Save
              </Button>
            </div>
          </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Order Items Card */}
            <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50 backdrop-blur-xl">
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-500" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wider">
                        <th className="p-4 pl-6 text-left font-semibold">Product</th>
                        <th className="p-4 text-center font-semibold">Price</th>
                        <th className="p-4 text-center font-semibold">Qty</th>
                        <th className="p-4 pr-6 text-right font-semibold">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                      {order.order_items?.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              {item.product?.image ? (
                                <img src={imgSrc(item.product.image)!} alt={item.product_name} className="h-12 w-12 rounded-lg object-cover shadow-sm border border-zinc-100 dark:border-zinc-800" />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                  <Package className="h-5 w-5 text-zinc-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-zinc-900 dark:text-zinc-100">{item.product_name}</p>
                                {item.variant_name && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{item.variant_name}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center text-muted-foreground font-medium">{formatIDR(item.price)}</td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-md w-8 h-8 font-semibold text-zinc-900 dark:text-zinc-100">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right font-bold text-zinc-900 dark:text-zinc-100">{formatIDR(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 border-t border-zinc-100 dark:border-zinc-800/50">
                <div className="w-full max-w-sm ml-auto space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground tabular-nums">{formatIDR(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-semibold text-foreground tabular-nums">{formatIDR(order.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (PPN 11%)</span>
                    <span className="font-semibold text-foreground tabular-nums">{formatIDR(order.tax)}</span>
                  </div>
                  <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
                  <div className="flex justify-between items-center text-lg font-extrabold" style={{ color: '#0058a3' }}>
                    <span>Total</span>
                    <span className="tabular-nums">{formatIDR(order.total)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Status Card */}
            <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50">
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-blue-500" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 ${order.paid_at ? 'border-green-100 bg-green-50 text-green-600 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400' : 'border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-500'}`}>
                      {order.paid_at ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{order.paid_at ? 'Payment Confirmed' : 'Waiting for Payment'}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {order.paid_at ? `Paid on ${new Date(order.paid_at).toLocaleString('id-ID')}` : 'Customer has not completed payment yet.'}
                      </p>
                    </div>
                  </div>

                  {order.xendit_invoice_id && !order.paid_at && (
                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                      <Button onClick={checkPayment} disabled={checking} variant="outline" className="w-full sm:w-auto rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
                        {checking ? 'Checking...' : 'Check Status'}
                      </Button>
                      
                      {order.payment_url && (
                        <a href={order.payment_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium px-2">
                          View Invoice Link ↗
                        </a>
                      )}
                      
                      {paymentMsg && (
                        <span className={`text-xs font-medium px-2 ${paymentMsg.includes('confirmed') ? 'text-green-600' : paymentMsg.includes('Waiting') ? 'text-amber-600' : 'text-red-600'}`}>
                          {paymentMsg}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar Info (Right Column) */}
          <div className="space-y-6">
            
            {/* Customer Info Card */}
            <Card className="border-0 shadow-lg shadow-zinc-200/30 dark:shadow-black/20 rounded-2xl bg-white dark:bg-zinc-900/50">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                  <User className="w-4 h-4" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-lg uppercase">
                    {order.user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{order.user?.name}</p>
                    <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info Card */}
            <Card className="border-0 shadow-lg shadow-zinc-200/30 dark:shadow-black/20 rounded-2xl bg-white dark:bg-zinc-900/50">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                  <Truck className="w-4 h-4" />
                  Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Courier Service</p>
                  <p className="font-bold flex items-center gap-2 text-foreground">
                    <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs uppercase tracking-wider">
                      {order.courier}
                    </span>
                  </p>
                </div>
                
                {order.address && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Delivery Address</p>
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3.5 rounded-xl text-sm border border-zinc-100 dark:border-zinc-800/50">
                      <p className="font-bold flex items-center gap-2 mb-1 text-foreground">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {order.address.recipient_name}
                      </p>
                      <p className="text-muted-foreground leading-relaxed pl-5">
                        {order.address.address}<br/>
                        {order.address.city}, {order.address.province} {order.address.postal_code}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method Card */}
            <Card className="border-0 shadow-lg shadow-zinc-200/30 dark:shadow-black/20 rounded-2xl bg-white dark:bg-zinc-900/50">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-foreground capitalize text-lg">{order.payment_method}</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
