<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'variant_name' => fake()->word(),
            'color' => fake()->colorName(),
            'size' => fake()->randomElement(['S', 'M', 'L', 'XL']),
            'material' => fake()->word(),
            'sku' => fake()->unique()->uuid(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'stock' => fake()->numberBetween(0, 100),
            'image' => null,
            'is_active' => fake()->boolean(),
        ];
    }
}
