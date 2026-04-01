<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $blogs = Blog::with('author')
            ->when($request->search, fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('blog/index', [
            'blogs' => $blogs,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('blog/form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'title_id' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'excerpt_id' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'content_id' => ['nullable', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'category_id_text' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'published_at' => ['nullable', 'date'],
            'tags' => ['nullable', 'array'],
            'tags.*.tag' => ['required', 'string', 'max:100'],
            'tags.*.tag_id' => ['nullable', 'string', 'max:100'],
        ]);

        $data['author_id'] = $request->user()->id;
        $data['slug'] = Str::slug($data['title']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('blogs', 'public');
        }

        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        $blog = Blog::create($data);

        if (!empty($tags)) {
            $blog->tags()->createMany($tags);
        }

        return redirect()->route('blogs.index');
    }

    public function edit(Blog $blog)
    {
        return Inertia::render('blog/form', [
            'blog' => $blog->load('tags'),
        ]);
    }

    public function update(Request $request, Blog $blog)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'title_id' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'excerpt_id' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'content_id' => ['nullable', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'category_id_text' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'published_at' => ['nullable', 'date'],
            'tags' => ['nullable', 'array'],
            'tags.*.tag' => ['required', 'string', 'max:100'],
            'tags.*.tag_id' => ['nullable', 'string', 'max:100'],
        ]);

        $data['slug'] = Str::slug($data['title']);

        if ($request->hasFile('image')) {
            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }
            $data['image'] = $request->file('image')->store('blogs', 'public');
        }

        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        $blog->update($data);

        $blog->tags()->delete();
        if (!empty($tags)) {
            $blog->tags()->createMany($tags);
        }

        return redirect()->route('blogs.index');
    }

    public function destroy(Blog $blog)
    {
        if ($blog->image) {
            Storage::disk('public')->delete($blog->image);
        }
        $blog->delete();
        return redirect()->route('blogs.index');
    }
}
