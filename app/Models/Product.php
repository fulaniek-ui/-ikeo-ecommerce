<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'brand_id', 'name', 'slug', 'description', 'description_id',
        'price', 'discount_price', 'image', 'stock', 'is_bestseller', 'is_featured',
        'material', 'dimensions', 'weight',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'discount_price' => 'decimal:2',
            'weight' => 'decimal:2',
            'is_bestseller' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    // ── Query Scopes ──

    public function scopeSearch($query, ?string $keyword)
    {
        return $query->when($keyword, fn ($q) => $q->where('name', 'like', "%{$keyword}%")
            ->orWhere('description', 'like', "%{$keyword}%")
            ->orWhere('material', 'like', "%{$keyword}%"));
    }

    public function scopeFilterCategory($query, ?string $slug)
    {
        return $query->when($slug, fn ($q) => $q->whereHas('category', fn ($cq) => $cq->where('slug', $slug)));
    }

    public function scopeFilterBrand($query, ?string $slug)
    {
        return $query->when($slug, fn ($q) => $q->whereHas('brand', fn ($bq) => $bq->where('slug', $slug)));
    }

    public function scopeFilterPrice($query, ?float $min, ?float $max)
    {
        return $query
            ->when($min, fn ($q) => $q->where('price', '>=', $min))
            ->when($max, fn ($q) => $q->where('price', '<=', $max));
    }

    public function scopeFilterFlags($query, ?bool $bestseller, ?bool $featured)
    {
        return $query
            ->when($bestseller, fn ($q) => $q->where('is_bestseller', true))
            ->when($featured, fn ($q) => $q->where('is_featured', true));
    }

    public function scopeApplySort($query, ?string $sort)
    {
        return match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'name_asc' => $query->orderBy('name'),
            'name_desc' => $query->orderByDesc('name'),
            'oldest' => $query->oldest(),
            default => $query->latest(),
        };
    }
}
