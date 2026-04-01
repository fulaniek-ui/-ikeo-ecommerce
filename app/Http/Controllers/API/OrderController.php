<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with('orderItems')
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

    public function store(Request $request)
    {
        $request->validate([
            'address_id' => ['required', 'exists:addresses,id'],
            'payment_method' => ['required', 'in:transfer,ewallet'],
            'courier' => ['required', 'in:JNE,GoSend,SiCepat'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.product_variant_id' => ['nullable', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        return DB::transaction(function () use ($request) {
            $subtotal = 0;
            $orderItems = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $variant = !empty($item['product_variant_id'])
                    ? ProductVariant::findOrFail($item['product_variant_id'])
                    : null;

                $price = $variant ? $variant->price : ($product->discount_price ?? $product->price);
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

            $shippingCost = 15000;
            $tax = round($subtotal * 0.11, 2);
            $total = $subtotal + $shippingCost + $tax;

            $order = Order::create([
                'user_id' => $request->user()->id,
                'address_id' => $request->address_id,
                'order_number' => 'IKEO-' . strtoupper(Str::random(8)),
                'payment_method' => $request->payment_method,
                'courier' => $request->courier,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'tax' => $tax,
                'total' => $total,
                'notes' => $request->notes,
            ]);

            $order->orderItems()->createMany($orderItems);

            return response()->json([
                'data' => $order->load('orderItems'),
                'message' => 'Order created',
            ], 201);
        });
    }
}
