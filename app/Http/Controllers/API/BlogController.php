<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $blogs = Blog::with('author', 'tags')
            ->whereNotNull('published_at')
            ->when($request->category, fn ($q, $c) => $q->where('category', $c))
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->latest('published_at')
            ->paginate($request->per_page ?? 10);

        return response()->json($blogs);
    }

    public function show(string $slug)
    {
        $blog = Blog::where('slug', $slug)
            ->whereNotNull('published_at')
            ->with('author', 'tags')
            ->first();

        if (! $blog) {
            return response()->json(['message' => 'Blog not found'], 404);
        }

        return response()->json(['data' => $blog]);
    }
}
