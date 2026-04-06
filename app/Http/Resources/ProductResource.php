<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'description_id' => $this->description_id,
            'price' => (float) $this->price,
            'discount_price' => $this->discount_price ? (float) $this->discount_price : null,
            'effective_price' => (float) ($this->discount_price ?? $this->price),
            'discount_percentage' => $this->discount_price
                ? round((1 - $this->discount_price / $this->price) * 100)
                : 0,
            'image' => $this->image,
            'image_url' => $this->image ? asset('storage/' . $this->image) : null,
            'stock' => $this->stock,
            'availability' => [
                'in_stock' => $this->stock > 0,
                'status' => $this->stock > 10 ? 'in_stock' : ($this->stock > 0 ? 'low_stock' : 'out_of_stock'),
                'label' => $this->stock > 10 ? 'In Stock' : ($this->stock > 0 ? "Only {$this->stock} left" : 'Out of Stock'),
            ],
            'is_bestseller' => $this->is_bestseller,
            'is_featured' => $this->is_featured,
            'material' => $this->material,
            'dimensions' => $this->dimensions,
            'weight' => $this->weight ? (float) $this->weight : null,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'name_id' => $this->category->name_id,
                'slug' => $this->category->slug,
            ]),
            'brand' => $this->whenLoaded('brand', fn () => [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
                'slug' => $this->brand->slug,
                'logo' => $this->brand->logo ? asset('storage/' . $this->brand->logo) : null,
            ]),
            'variants' => $this->whenLoaded('variants'),
            'images' => $this->whenLoaded('images', fn () => $this->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => asset('storage/' . $img->image_url),
                'sort_order' => $img->sort_order,
            ])),
            'reviews_count' => $this->whenCounted('reviews'),
            'reviews_avg_rating' => $this->when(
                $this->reviews_avg_rating !== null,
                fn () => round((float) $this->reviews_avg_rating, 1)
            ),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
