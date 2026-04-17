<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with('orderItems.product:id,name,slug,image')
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'data' => $order->load('address', 'orderItems.product', 'orderItems.productVariant'),
        ]);
    }

    public function store(Request $request, XenditService $xendit)
    {
        $request->validate([
            'address_id' => ['required', 'exists:addresses,id'],
            'payment_method' => ['required', 'in:transfer,ewallet'],
            'courier' => ['required', 'in:JNE,GoSend,SiCepat'],
            'notes' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array', 'min:1', 'max:20'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.product_variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        return DB::transaction(function () use ($request, $xendit) {
            $subtotal = 0;
            $orderItems = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $variant = ! empty($item['product_variant_id'])
                    ? ProductVariant::findOrFail($item['product_variant_id'])
                    : null;

                $price = $variant ? $variant->price : ($product->discount_price ?: $product->price);

                if ($price <= 0) {
                    abort(422, "Product '{$product->name}' has invalid price.");
                }

                if ($product->stock < $item['quantity']) {
                    abort(422, "Product '{$product->name}' only has {$product->stock} items in stock.");
                }

                $itemSubtotal = $price * $item['quantity'];
                $subtotal += $itemSubtotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_variant_id' => $variant?->id,
                    'product_name' => $product->name,
                    'variant_name' => $variant?->variant_name,
                    'price' => $price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $itemSubtotal,
                ];
            }

            if ($subtotal <= 0) {
                abort(422, 'Order total cannot be zero. Please add valid items.');
            }

            $shippingCost = 15000;
            $tax = round($subtotal * 0.11, 2);
            $total = $subtotal + $shippingCost + $tax;
            $orderNumber = 'IKEO-'.strtoupper(Str::random(8));

            $order = Order::create([
                'user_id' => $request->user()->id,
                'address_id' => $request->address_id,
                'order_number' => $orderNumber,
                'payment_method' => $request->payment_method,
                'courier' => $request->courier,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'tax' => $tax,
                'total' => $total,
                'notes' => $request->notes,
            ]);

            $order->orderItems()->createMany($orderItems);

            // Reduce stock
            foreach ($request->items as $item) {
                Product::where('id', $item['product_id'])->decrement('stock', $item['quantity']);
                if (!empty($item['product_variant_id'])) {
                    ProductVariant::where('id', $item['product_variant_id'])->decrement('stock', $item['quantity']);
                }
            }

            // Create Xendit invoice
            $invoice = $xendit->createInvoice([
                'external_id' => $orderNumber,
                'amount' => $total,
                'payer_email' => $request->user()->email,
                'description' => "IKEO Order #{$orderNumber}",
                'success_url' => config('app.url').'/api/payments/success?order='.$order->id,
                'failure_url' => config('app.url').'/api/payments/failure?order='.$order->id,
            ]);

            $order->update([
                'xendit_invoice_id' => $invoice['id'],
                'payment_url' => $invoice['invoice_url'],
            ]);

            return response()->json([
                'data' => $order->load('orderItems'),
                'payment_url' => $invoice['invoice_url'],
                'message' => 'Order created. Redirect to payment.',
            ], 201);
        });
    }
}
