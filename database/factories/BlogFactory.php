<?php

namespace Database\Factories;

use App\Models\Blog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Blog>
 */
class BlogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'author_id' => \App\Models\User::factory(),
            'title' => fake()->sentence(),
            'title_id' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'excerpt' => fake()->paragraph(),
            'excerpt_id' => fake()->paragraph(),
            'content' => fake()->text(1000),
            'content_id' => fake()->text(1000),
            'category' => fake()->word(),
            'category_id_text' => fake()->word(),
            'image' => null,
            'published_at' => fake()->boolean() ? fake()->dateTime() : null,
        ];
    }
}
