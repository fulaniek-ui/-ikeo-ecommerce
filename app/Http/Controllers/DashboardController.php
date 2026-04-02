<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Consultation;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'categories' => Category::count(),
                'brands' => Brand::count(),
                'products' => Product::count(),
                'users' => User::where('role', 'user')->count(),
                'orders' => Order::count(),
                'pendingOrders' => Order::where('status', 'pending')->count(),
                'revenue' => Order::where('status', 'delivered')->sum('total'),
                'todayRevenue' => Order::where('status', 'delivered')->whereDate('delivered_at', today())->sum('total'),
                'totalStock' => Product::sum('stock'),
                'outOfStock' => Product::where('stock', 0)->count(),
                'reviews' => Review::count(),
                'consultations' => Consultation::where('status', 'pending')->count(),
            ],
            'latestOrders' => Order::with('user')->latest()->take(5)->get(),
            'latestProducts' => Product::with('category', 'brand')->latest()->take(5)->get(),
            'lowStock' => Product::where('stock', '<=', 5)->where('stock', '>', 0)->take(5)->get(),
            'topProducts' => Product::withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->orderByDesc('reviews_count')
                ->take(5)
                ->get(),
        ]);
    }
}
