<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Category::withCount('products')->get(),
        ]);
    }

    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)->with('products')->first();

        if (! $category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json(['data' => $category]);
    }
}
