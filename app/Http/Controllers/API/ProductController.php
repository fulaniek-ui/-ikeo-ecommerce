<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category', 'brand')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->search($request->search)
            ->filterCategory($request->category)
            ->filterBrand($request->brand)
            ->filterPrice($request->min_price, $request->max_price)
            ->filterFlags($request->boolean('bestseller'), $request->boolean('featured'))
            ->applySort($request->sort)
            ->paginate($request->per_page ?? 12)
            ->withQueryString();

        $filters = [
            'categories' => Category::select('id', 'name', 'name_id', 'slug')
                ->withCount('products')
                ->orderBy('name')
                ->get(),
            'brands' => Brand::select('id', 'name', 'slug')
                ->withCount('products')
                ->orderBy('name')
                ->get(),
            'price_range' => [
                'min' => (float) Product::min('price'),
                'max' => (float) Product::max('price'),
            ],
            'sort_options' => [
                ['value' => 'latest', 'label' => 'Newest'],
                ['value' => 'oldest', 'label' => 'Oldest'],
                ['value' => 'price_asc', 'label' => 'Price: Low to High'],
                ['value' => 'price_desc', 'label' => 'Price: High to Low'],
                ['value' => 'name_asc', 'label' => 'Name: A-Z'],
                ['value' => 'name_desc', 'label' => 'Name: Z-A'],
            ],
            'applied' => [
                'search' => $request->search,
                'category' => $request->category,
                'brand' => $request->brand,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
                'sort' => $request->sort ?? 'latest',
                'bestseller' => $request->boolean('bestseller'),
                'featured' => $request->boolean('featured'),
            ],
        ];

        return (new ProductCollection($products))->setFilters($filters);
    }

    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->with(['category', 'brand', 'variants' => fn ($q) => $q->where('is_active', true), 'images' => fn ($q) => $q->orderBy('sort_order'), 'reviews.user'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Related products from same category
        $related = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('brand')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->inRandomOrder()
            ->take(4)
            ->get();

        return response()->json([
            'data' => new ProductResource($product),
            'related' => ProductResource::collection($related),
        ]);
    }
}
