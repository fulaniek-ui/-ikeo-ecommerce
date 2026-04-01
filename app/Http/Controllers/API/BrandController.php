<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Brand;

class BrandController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Brand::withCount('products')->get(),
        ]);
    }

    public function show(string $slug)
    {
        $brand = Brand::where('slug', $slug)->with('products')->first();

        if (!$brand) {
            return response()->json(['message' => 'Brand not found'], 404);
        }

        return response()->json(['data' => $brand]);
    }
}
