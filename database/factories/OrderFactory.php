<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'address_id' => Address::factory(),
            'order_number' => fake()->unique()->bothify('ORD-####-????'),
            'status' => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            'payment_method' => fake()->randomElement(['transfer', 'ewallet']),
            'courier' => fake()->randomElement(['JNE', 'GoSend', 'SiCepat']),
            'subtotal' => fake()->randomFloat(2, 50, 5000),
            'shipping_cost' => fake()->randomFloat(2, 5, 50),
            'tax' => fake()->randomFloat(2, 5, 500),
            'total' => fake()->randomFloat(2, 100, 6000),
            'notes' => fake()->optional()->sentence(),
            'paid_at' => fake()->boolean() ? fake()->dateTime() : null,
            'shipped_at' => fake()->boolean() ? fake()->dateTime() : null,
            'delivered_at' => fake()->boolean() ? fake()->dateTime() : null,
        ];
    }
}
