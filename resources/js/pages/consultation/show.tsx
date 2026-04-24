import { Head, useForm, Link } from '@inertiajs/react';
import { MessageSquare, Calendar, User, Mail, Phone, Store, ArrowLeft, CheckCircle2, Bookmark, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { Consultation } from '@/types';

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
      
      <div className="max-w-5xl mx-auto p-6 sm:p-8 lg:p-10 space-y-8">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/consultations" className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {consultation.name}
                  </h2>
                  <Badge className={`px-3 py-1 text-xs font-semibold border ${statusColor[consultation.status] || ''}`}>
                    {capitalize(consultation.status)}
                  </Badge>
                </div>
                <p className="text-indigo-100/70 text-sm mt-1 flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  Inquiry for Design Consultation
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex bg-white/10 backdrop-blur-sm p-2 rounded-2xl border border-white/10 items-center gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm font-medium text-muted-foreground ml-2 hidden sm:inline-block">Status:</span>
              <div className="w-[160px]">
                <Select value={data.status} onValueChange={(v) => setData('status', v as Consultation['status'])}>
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs focus:ring-indigo-500 rounded-xl h-10">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl z-[1000] min-w-[180px] overflow-hidden">
                    {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
                      <SelectItem key={s} value={s} className="cursor-pointer py-2.5 px-3 focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-700 dark:focus:text-indigo-400 m-1 rounded-lg font-medium transition-colors">
                        {capitalize(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button disabled={processing} type="submit" size="sm" className="rounded-xl h-10 px-5 bg-white text-indigo-700 hover:bg-indigo-50 shadow-md transition-all font-bold">
                <Save className="w-4 h-4 mr-2" />
                Update
              </Button>
            </div>
          </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/50 backdrop-blur-xl">
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-500" />
                  Consultation Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {consultation.message ? (
                  <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 italic leading-relaxed text-zinc-700 dark:text-zinc-300">
                    "{consultation.message}"
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm italic">No specific message was provided with this inquiry.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl shadow-zinc-200/40 dark:shadow-black/20 rounded-3xl bg-white dark:bg-zinc-900/50 overflow-hidden">
               <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Request Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800">
                  <div className="p-8 space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Preferred Date</p>
                    <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-500" />
                      {new Date(consultation.preferred_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="p-8 space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Target Location</p>
                    <p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Store className="w-5 h-5 text-amber-500" />
                      {consultation.store?.name || 'General Inquiry'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-6">
            
            <Card className="border-0 shadow-lg shadow-zinc-200/30 dark:shadow-black/20 rounded-2xl bg-white dark:bg-zinc-900/50">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                <CardTitle className="text-xs font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                  <User className="w-4 h-4 text-indigo-500" />
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{consultation.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5"><Mail className="w-3 h-3"/> Email Address</p>
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 break-all">{consultation.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5"><Phone className="w-3 h-3"/> Phone Number</p>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{consultation.phone}</p>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">Status Tracking</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Updating the status helps the customer know if their consultation has been acknowledged or completed.
              </p>
            </div>

          </div>

        </div>
      </div>
    </AppLayout>
  );
}
