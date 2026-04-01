<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $stores = Store::query()
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('store/index', [
            'stores' => $stores,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('store/form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'city' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
            'hours_id' => ['nullable', 'string', 'max:255'],
            'hours_en' => ['nullable', 'string', 'max:255'],
        ]);

        Store::create($data);

        return redirect()->route('stores.index');
    }

    public function edit(Store $store)
    {
        return Inertia::render('store/form', compact('store'));
    }

    public function update(Request $request, Store $store)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'city' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
            'hours_id' => ['nullable', 'string', 'max:255'],
            'hours_en' => ['nullable', 'string', 'max:255'],
        ]);

        $store->update($data);

        return redirect()->route('stores.index');
    }

    public function destroy(Store $store)
    {
        $store->delete();
        return redirect()->route('stores.index');
    }
}
