<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\XenditService;
use Illuminate\Http\Request;

class XenditController extends Controller
{
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

        // Find user: try auth token first, then by email
        $user = $request->user('sanctum')
            ?? User::where('email', $request->payer_email)->first();

        // Calculate amounts
        $shipping = 15000;
        $itemsTotal = 0;

        if ($request->items) {
            foreach ($request->items as $item) {
                $itemsTotal += ($item['price'] ?? 0) * ($item['quantity'] ?? 1);
            }
        }

        $subtotal = $itemsTotal > 0 ? $itemsTotal : ($request->amount - $shipping);
        $tax = round($subtotal * 0.11, 2);
        $total = $request->amount;

        // Always create order in database
        $order = Order::create([
            'user_id' => $user?->id ?? 0,
            'address_id' => $user?->addresses()->where('is_default', true)->first()?->id
                ?? $user?->addresses()->first()?->id ?? 0,
            'order_number' => $request->external_id,
            'status' => 'pending',
            'payment_method' => 'transfer',
            'courier' => $request->input('customer.courier', 'JNE'),
            'subtotal' => $subtotal,
            'shipping_cost' => $shipping,
            'tax' => $tax,
            'total' => $total,
            'notes' => $request->input('customer.given_names')
                ? "Customer: {$request->input('customer.given_names')} ({$request->payer_email})"
                : null,
        ]);

        // Save order items
        if ($request->items) {
            foreach ($request->items as $item) {
                $product = Product::where('name', $item['name'] ?? '')->first()
                    ?? Product::where('name', 'like', '%' . ($item['name'] ?? '') . '%')->first();

                $order->orderItems()->create([
                    'product_id' => $product?->id ?? 0,
                    'product_name' => $item['name'] ?? 'Unknown',
                    'price' => $item['price'] ?? 0,
                    'quantity' => $item['quantity'] ?? 1,
                    'subtotal' => ($item['price'] ?? 0) * ($item['quantity'] ?? 1),
                ]);
            }
        }

        // Create Xendit invoice
        $invoice = $xendit->createInvoice([
            'external_id' => $request->external_id,
            'amount' => $total,
            'payer_email' => $request->payer_email,
            'description' => $request->description,
            'success_url' => $request->success_redirect_url ?? config('app.url'),
            'failure_url' => $request->failure_redirect_url ?? config('app.url'),
        ]);

        $order->update([
            'xendit_invoice_id' => $invoice['id'],
            'payment_url' => $invoice['invoice_url'],
        ]);

        return response()->json([
            'invoice_id' => $invoice['id'],
            'invoice_url' => $invoice['invoice_url'],
            'external_id' => $request->external_id,
            'status' => $invoice['status'] ?? 'PENDING',
            'amount' => $total,
            'expiry_date' => $invoice['expiry_date'] ?? null,
        ]);
    }

    public function getInvoiceStatus(string $invoiceId, XenditService $xendit)
    {
        $invoice = $xendit->getInvoice($invoiceId);

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
