<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string'],
        ]);

        $existing = Review::where('user_id', $request->user()->id)
            ->where('product_id', $data['product_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You already reviewed this product'], 422);
        }

        $review = Review::create([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        return response()->json(['data' => $review, 'message' => 'Review submitted'], 201);
    }
}
