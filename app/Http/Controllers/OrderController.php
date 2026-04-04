<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('user', 'address')
            ->when($request->search, fn ($q, $search) => $q->where('order_number', 'like', "%{$search}%"))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('order/index', [
            'orders' => $orders,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function show(Order $order)
    {
        return Inertia::render('order/show', [
            'order' => $order->load('user', 'address', 'orderItems.product', 'orderItems.productVariant'),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,processing,shipped,delivered,cancelled'],
        ]);

        if ($data['status'] === 'shipped' && ! $order->shipped_at) {
            $data['shipped_at'] = now();
        }

        if ($data['status'] === 'delivered' && ! $order->delivered_at) {
            $data['delivered_at'] = now();
        }

        $order->update($data);

        return redirect()->route('orders.index');
    }
}
