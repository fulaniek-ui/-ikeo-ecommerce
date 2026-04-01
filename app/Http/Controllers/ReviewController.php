<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = Review::with('user', 'product')
            ->when($request->search, fn ($q, $search) => $q->whereHas('product', fn ($pq) => $pq->where('name', 'like', "%{$search}%")))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('review/index', [
            'reviews' => $reviews,
            'filters' => $request->only('search'),
        ]);
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return redirect()->route('reviews.index');
    }
}
