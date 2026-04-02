<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Xendit webhook callback — called by Xendit when payment status changes.
     * Set this URL in Xendit Dashboard: https://yourdomain.com/api/payments/webhook
     */
    public function webhook(Request $request)
    {
        $webhookToken = config('services.xendit.webhook_token');

        if ($webhookToken && $request->header('x-callback-token') !== $webhookToken) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $externalId = $request->input('external_id');
        $status = $request->input('status');

        $order = Order::where('order_number', $externalId)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($status === 'PAID' || $status === 'SETTLED') {
            $order->update([
                'status' => 'processing',
                'paid_at' => now(),
            ]);
        } elseif ($status === 'EXPIRED') {
            $order->update([
                'status' => 'cancelled',
            ]);
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
