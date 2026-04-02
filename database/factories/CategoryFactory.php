<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'name_id' => fake()->word(),
            'slug' => fake()->unique()->slug(),
            'icon' => null,
            'description' => fake()->sentence(),
            'description_id' => fake()->sentence(),
            'image' => null,
        ];
    }
}
