<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Address;
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
            // Address fields from frontend checkout
            'recipient_name' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'courier' => ['nullable', 'string'],
            'payment_method' => ['nullable', 'string'],
        ]);

        // Find user
        $user = $request->user('sanctum')
            ?? User::where('email', $request->payer_email)->first();

        // Create or find address from checkout form
        $addressId = 0;
        $customerName = $request->input('customer.given_names', $request->recipient_name ?? '');
        $customerPhone = $request->input('customer.mobile_number', $request->phone ?? '');
        $customerAddress = $request->input('customer.address', $request->address ?? '');

        if ($user && $customerAddress) {
            $address = Address::create([
                'user_id' => $user->id,
                'label' => 'Checkout',
                'recipient_name' => $customerName ?: $user->name,
                'phone' => $customerPhone ?: '',
                'address' => $customerAddress,
                'city' => $request->input('city', ''),
                'province' => $request->input('province', ''),
                'postal_code' => $request->input('postal_code', ''),
                'is_default' => false,
            ]);
            $addressId = $address->id;
        } elseif ($user) {
            $addressId = $user->addresses()->where('is_default', true)->first()?->id
                ?? $user->addresses()->first()?->id ?? 0;
        }

        // Calculate amounts
        $shipping = $request->input('shipping_cost', 15000);
        $itemsTotal = 0;
        if ($request->items) {
            foreach ($request->items as $item) {
                $itemsTotal += ($item['price'] ?? 0) * ($item['quantity'] ?? 1);
            }
        }
        $subtotal = $itemsTotal > 0 ? $itemsTotal : ($request->amount - $shipping);
        $tax = round($subtotal * 0.11, 2);
        $total = $request->amount;

        // Determine payment method and courier
        $paymentMethod = $request->payment_method === 'cod' ? 'ewallet' : 'transfer';
        $courier = $request->courier ?? $request->input('customer.courier', 'JNE');
        // Map courier names
        $courierMap = ['jne' => 'JNE', 'gosend' => 'GoSend', 'sicepat' => 'SiCepat'];
        $courier = $courierMap[strtolower($courier)] ?? 'JNE';

        // Create order
        $order = Order::create([
            'user_id' => $user?->id ?? 0,
            'address_id' => $addressId,
            'order_number' => $request->external_id,
            'status' => 'pending',
            'payment_method' => $paymentMethod,
            'courier' => $courier,
            'subtotal' => $subtotal,
            'shipping_cost' => $shipping,
            'tax' => $tax,
            'total' => $total,
            'notes' => $customerAddress
                ? "Recipient: {$customerName}, Phone: {$customerPhone}, Address: {$customerAddress}"
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

        // Create Xendit invoice with customer info
        $invoice = $xendit->createInvoice([
            'external_id' => $request->external_id,
            'amount' => $total,
            'payer_email' => $request->payer_email,
            'description' => $request->description,
            'success_url' => $request->success_redirect_url ?? config('app.url'),
            'failure_url' => $request->failure_redirect_url ?? config('app.url'),
            'customer' => [
                'given_names' => $customerName,
                'email' => $request->payer_email,
                'mobile_number' => $customerPhone ? preg_replace('/[^0-9+]/', '', $customerPhone) : null,
            ],
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
