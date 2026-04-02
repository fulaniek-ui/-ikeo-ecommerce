<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\XenditService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Check payment status langsung ke Xendit (tanpa webhook).
     * Bisa dipanggil oleh customer atau admin.
     */
    public function checkStatus(Request $request, Order $order, XenditService $xendit)
    {
        if (!$order->xendit_invoice_id) {
            return response()->json(['message' => 'No payment invoice found'], 404);
        }

        // Kalau sudah paid, tidak perlu cek lagi
        if ($order->paid_at) {
            return response()->json([
                'data' => $order,
                'payment_status' => 'PAID',
                'message' => 'Already paid',
            ]);
        }

        // Tanya langsung ke Xendit
        $invoice = $xendit->getInvoice($order->xendit_invoice_id);
        $xenditStatus = $invoice['status'];

        if ($xenditStatus === 'PAID' || $xenditStatus === 'SETTLED') {
            $order->update([
                'status' => 'processing',
                'paid_at' => now(),
            ]);
        } elseif ($xenditStatus === 'EXPIRED') {
            $order->update([
                'status' => 'cancelled',
            ]);
        }

        return response()->json([
            'data' => $order->fresh(),
            'payment_status' => $xenditStatus,
            'message' => match ($xenditStatus) {
                'PAID', 'SETTLED' => 'Payment confirmed!',
                'PENDING' => 'Waiting for payment',
                'EXPIRED' => 'Payment expired',
                default => "Status: {$xenditStatus}",
            },
        ]);
    }

    /**
     * Xendit webhook callback (untuk production nanti).
     */
    public function webhook(Request $request)
    {
        $webhookToken = config('services.xendit.webhook_token');

        if ($webhookToken && $request->header('x-callback-token') !== $webhookToken) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $order = Order::where('order_number', $request->input('external_id'))->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $status = $request->input('status');

        if ($status === 'PAID' || $status === 'SETTLED') {
            $order->update(['status' => 'processing', 'paid_at' => now()]);
        } elseif ($status === 'EXPIRED') {
            $order->update(['status' => 'cancelled']);
        }

        return response()->json(['message' => 'Webhook processed']);
    }

    public function success(Request $request)
    {
        return response()->json([
            'message' => 'Payment successful',
            'order_id' => $request->query('order'),
        ]);
    }

    public function failure(Request $request)
    {
        return response()->json([
            'message' => 'Payment failed or cancelled',
            'order_id' => $request->query('order'),
        ]);
    }
}
