<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductVariantController extends Controller
{
    public function index(Request $request, $product_id)
    {
        $product = Product::findOrFail($product_id);
        $variants = ProductVariant::where('product_id', $product_id)
            ->when($request->search, fn ($q, $search) => $q->where('variant_name', 'like', "%{$search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('product/variant/index', [
            'product' => $product,
            'variants' => $variants,
            'filters' => $request->only('search'),
        ]);
    }

    public function create($product_id)
    {
        return Inertia::render('product/variant/form', [
            'product' => Product::findOrFail($product_id),
        ]);
    }

    public function store(Request $request, $product_id)
    {
        $data = $request->validate([
            'variant_name' => ['required', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:100'],
            'size' => ['nullable', 'string', 'max:100'],
            'material' => ['nullable', 'string', 'max:100'],
            'sku' => ['required', 'string', 'max:100', 'unique:product_variants,sku'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'is_active' => ['boolean'],
        ]);

        $data['product_id'] = $product_id;

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('variants', 'public');
        }

        ProductVariant::create($data);

        return redirect()->route('variants.index', $product_id);
    }

    public function edit($product_id, $variant_id)
    {
        return Inertia::render('product/variant/form', [
            'product' => Product::findOrFail($product_id),
            'variant' => ProductVariant::findOrFail($variant_id),
        ]);
    }

    public function update(Request $request, $product_id, $variant_id)
    {
        $variant = ProductVariant::findOrFail($variant_id);

        $data = $request->validate([
            'variant_name' => ['required', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:100'],
            'size' => ['nullable', 'string', 'max:100'],
            'material' => ['nullable', 'string', 'max:100'],
            'sku' => ['required', 'string', 'max:100', 'unique:product_variants,sku,'.$variant->id],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'is_active' => ['boolean'],
        ]);

        if ($request->hasFile('image')) {
            if ($variant->image) {
                Storage::disk('public')->delete($variant->image);
            }
            $data['image'] = $request->file('image')->store('variants', 'public');
        }

        $variant->update($data);

        return redirect()->route('variants.index', $product_id);
    }

    public function destroy($product_id, $variant_id)
    {
        $variant = ProductVariant::findOrFail($variant_id);
        if ($variant->image) {
            Storage::disk('public')->delete($variant->image);
        }
        $variant->delete();

        return redirect()->route('variants.index', $product_id);
    }
}
