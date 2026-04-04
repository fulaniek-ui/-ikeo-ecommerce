<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category', 'brand')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->category, fn ($q, $c) => $q->whereHas('category', fn ($cq) => $cq->where('slug', $c)))
            ->when($request->brand, fn ($q, $b) => $q->whereHas('brand', fn ($bq) => $bq->where('slug', $b)))
            ->when($request->min_price, fn ($q, $min) => $q->where('price', '>=', $min))
            ->when($request->max_price, fn ($q, $max) => $q->where('price', '<=', $max))
            ->when($request->boolean('bestseller'), fn ($q) => $q->where('is_bestseller', true))
            ->when($request->boolean('featured'), fn ($q) => $q->where('is_featured', true))
            ->when($request->sort === 'price_asc', fn ($q) => $q->orderBy('price'))
            ->when($request->sort === 'price_desc', fn ($q) => $q->orderByDesc('price'))
            ->when(! $request->sort, fn ($q) => $q->latest())
            ->paginate($request->per_page ?? 12);

        return response()->json($products);
    }

    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->with('category', 'brand', 'variants', 'images', 'reviews.user')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->first();

        if (! $product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json(['data' => $product]);
    }
}
