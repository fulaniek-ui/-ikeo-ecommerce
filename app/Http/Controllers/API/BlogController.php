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

    public function show(string $slugOrId)
    {
        $blog = Blog::whereNotNull('published_at')
            ->where(fn ($q) => $q->where('slug', $slugOrId)->orWhere('id', is_numeric($slugOrId) ? $slugOrId : 0))
            ->with('author', 'tags')
            ->first();

        if (! $blog) {
            return response()->json(['message' => 'Blog not found'], 404);
        }

        // Related articles: same tags or same category
        $tagNames = $blog->tags->pluck('tag')->toArray();
        $related = Blog::whereNotNull('published_at')
            ->where('id', '!=', $blog->id)
            ->where(function ($q) use ($tagNames, $blog) {
                $q->whereHas('tags', fn ($t) => $t->whereIn('tag', $tagNames))
                  ->orWhere('category', $blog->category);
            })
            ->with('tags')
            ->latest('published_at')
            ->take(5)
            ->get(['id', 'title', 'slug', 'category', 'image', 'published_at']);

        return response()->json([
            'data' => $blog,
            'related' => $related,
        ]);
    }
}
