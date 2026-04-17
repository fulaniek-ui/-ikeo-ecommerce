<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Public catalog (React fetches from API)
Route::inertia('/catalog', 'catalog/index')->name('catalog.index');
Route::inertia('/catalog/{slug}', 'catalog/show')->name('catalog.show');
Route::inertia('/blog', 'blog-public/index')->name('blog.public.index');
Route::inertia('/blog/{slug}', 'blog-public/show')->name('blog.public.show');

Route::middleware(['auth', 'checkAdmin'])->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', CategoryController::class)->except('show');
    Route::resource('brands', BrandController::class)->except('show');
    Route::resource('products', ProductController::class)->except('show');
    Route::resource('stores', StoreController::class)->except('show');
    Route::resource('blogs', BlogController::class)->except('show');

    Route::prefix('products/{product_id}')->group(function () {
        Route::get('variants', [ProductVariantController::class, 'index'])->name('variants.index');
        Route::get('variants/create', [ProductVariantController::class, 'create'])->name('variants.create');
        Route::post('variants', [ProductVariantController::class, 'store'])->name('variants.store');
        Route::get('variants/{variant_id}/edit', [ProductVariantController::class, 'edit'])->name('variants.edit');
        Route::patch('variants/{variant_id}', [ProductVariantController::class, 'update'])->name('variants.update');
        Route::delete('variants/{variant_id}', [ProductVariantController::class, 'destroy'])->name('variants.destroy');
    });

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('orders/{order}', [OrderController::class, 'update'])->name('orders.update');

    Route::get('consultations', [ConsultationController::class, 'index'])->name('consultations.index');
    Route::get('consultations/{consultation}', [ConsultationController::class, 'show'])->name('consultations.show');
    Route::patch('consultations/{consultation}', [ConsultationController::class, 'update'])->name('consultations.update');

    Route::get('reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
});

require __DIR__.'/settings.php';
