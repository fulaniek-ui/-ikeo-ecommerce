<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => \App\Models\Category::factory(),
            'brand_id' => \App\Models\Brand::factory(),
            'name' => fake()->words(3, true),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraph(),
            'description_id' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'discount_price' => fake()->optional()->randomFloat(2, 5, 900),
            'image' => 'https://via.placeholder.com/640x480.png',
            'stock' => fake()->numberBetween(0, 100),
            'is_bestseller' => fake()->boolean(),
            'is_featured' => fake()->boolean(),
            'material' => fake()->word(),
            'dimensions' => fake()->randomNumber(2) . 'x' . fake()->randomNumber(2),
            'weight' => fake()->randomFloat(2, 0.5, 50),
        ];
    }
}
