<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category', 'brand')
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->when($request->category, fn ($q, $cat) => $q->where('category_id', $cat))
            ->when($request->brand, fn ($q, $brand) => $q->where('brand_id', $brand))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('product/index', [
            'products' => $products,
            'filters' => $request->only('search', 'category', 'brand'),
            'categories' => Category::all(['id', 'name']),
            'brands' => Brand::all(['id', 'name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('product/form', [
            'categories' => Category::all(['id', 'name']),
            'brands' => Brand::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'brand_id' => ['required', 'exists:brands,id'],
            'description' => ['nullable', 'string'],
            'description_id' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_bestseller' => ['boolean'],
            'is_featured' => ['boolean'],
            'material' => ['nullable', 'string', 'max:255'],
            'dimensions' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'numeric', 'min:0'],
        ]);

        $data['slug'] = Str::slug($data['name']);
        $data['image'] = $request->file('image')->store('products', 'public');

        Product::create($data);

        return redirect()->route('products.index');
    }

    public function edit(Product $product)
    {
        return Inertia::render('product/form', [
            'product' => $product->load('images'),
            'categories' => Category::all(['id', 'name']),
            'brands' => Brand::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'brand_id' => ['required', 'exists:brands,id'],
            'description' => ['nullable', 'string'],
            'description_id' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_bestseller' => ['boolean'],
            'is_featured' => ['boolean'],
            'material' => ['nullable', 'string', 'max:255'],
            'dimensions' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'numeric', 'min:0'],
        ]);

        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return redirect()->route('products.index');
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return redirect()->route('products.index');
    }
}
