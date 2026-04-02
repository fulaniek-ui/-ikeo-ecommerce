<?php

namespace Database\Factories;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => \App\Models\Order::factory(),
            'product_id' => \App\Models\Product::factory(),
            'product_variant_id' => null,
            'product_name' => fake()->words(3, true),
            'variant_name' => null,
            'price' => fake()->randomFloat(2, 10, 1000),
            'quantity' => fake()->numberBetween(1, 5),
            'subtotal' => fake()->randomFloat(2, 10, 5000),
        ];
    }
}
