<?php

namespace Database\Factories;

use App\Models\Consultation;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Consultation>
 */
class ConsultationFactory extends Factory
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
            'store_id' => Store::inRandomOrder()->first()?->id ?? Store::factory(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'preferred_date' => fake()->date(),
            'message' => fake()->paragraph(),
            'status' => fake()->randomElement(['pending', 'confirmed', 'completed', 'cancelled']),
        ];
    }
}
