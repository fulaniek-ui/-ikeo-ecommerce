<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class XenditController extends Controller
{
    /**
     * Create Xendit invoice — called by frontend Checkout page.
     * POST /api/xendit/invoice
     */
    public function createInvoice(Request $request, XenditService $xendit)
    {
        $request->validate([
            'external_id' => ['required', 'string'],
            'amount' => ['required', 'numeric', 'min:1'],
            'payer_email' => ['required', 'email'],
            'description' => ['required', 'string'],
            'customer' => ['nullable', 'array'],
            'items' => ['nullable', 'array'],
            'success_redirect_url' => ['nullable', 'string'],
            'failure_redirect_url' => ['nullable', 'string'],
        ]);

        // Create order in database if user is authenticated
        $user = $request->user('sanctum');
        if ($user) {
            $address = $user->addresses()->where('is_default', true)->first()
                ?? $user->addresses()->first();

            $subtotal = $request->amount * 0.85; // rough estimate before tax/shipping
            $shipping = 15000;
            $tax = round($subtotal * 0.11, 2);

            $order = Order::create([
                'user_id' => $user->id,
                'address_id' => $address?->id ?? 0,
                'order_number' => $request->external_id,
                'status' => 'pending',
                'payment_method' => 'transfer',
                'courier' => 'JNE',
                'subtotal' => $request->amount - $shipping - $tax,
                'shipping_cost' => $shipping,
                'tax' => $tax,
                'total' => $request->amount,
            ]);

            // Save order items from request
            if ($request->items) {
                foreach ($request->items as $item) {
                    $product = Product::where('name', 'like', '%' . ($item['name'] ?? '') . '%')->first();
                    $order->orderItems()->create([
                        'product_id' => $product?->id ?? 0,
                        'product_name' => $item['name'] ?? 'Unknown',
                        'price' => $item['price'] ?? 0,
                        'quantity' => $item['quantity'] ?? 1,
                        'subtotal' => ($item['price'] ?? 0) * ($item['quantity'] ?? 1),
                    ]);
                }
            }
        }

        // Create Xendit invoice
        $invoice = $xendit->createInvoice([
            'external_id' => $request->external_id,
            'amount' => $request->amount,
            'payer_email' => $request->payer_email,
            'description' => $request->description,
            'success_url' => $request->success_redirect_url ?? config('app.url'),
            'failure_url' => $request->failure_redirect_url ?? config('app.url'),
        ]);

        // Update order with Xendit info
        if (isset($order)) {
            $order->update([
                'xendit_invoice_id' => $invoice['id'],
                'payment_url' => $invoice['invoice_url'],
            ]);
        }

        return response()->json([
            'invoice_id' => $invoice['id'],
            'invoice_url' => $invoice['invoice_url'],
            'external_id' => $request->external_id,
            'status' => $invoice['status'] ?? 'PENDING',
            'amount' => $request->amount,
            'expiry_date' => $invoice['expiry_date'] ?? null,
        ]);
    }

    /**
     * Get invoice status
     * GET /api/xendit/invoice/{invoiceId}
     */
    public function getInvoiceStatus(string $invoiceId, XenditService $xendit)
    {
        $invoice = $xendit->getInvoice($invoiceId);

        // Also update order status if paid
        $status = $invoice['status'] ?? '';
        if ($status === 'PAID' || $status === 'SETTLED') {
            $order = Order::where('xendit_invoice_id', $invoiceId)->first();
            if ($order && !$order->paid_at) {
                $order->update([
                    'status' => 'processing',
                    'paid_at' => now(),
                ]);
            }
        }

        return response()->json([
            'invoice_id' => $invoice['id'] ?? $invoiceId,
            'invoice_url' => $invoice['invoice_url'] ?? '',
            'external_id' => $invoice['external_id'] ?? '',
            'status' => $status,
            'amount' => $invoice['amount'] ?? 0,
            'expiry_date' => $invoice['expiry_date'] ?? null,
        ]);
    }
}
