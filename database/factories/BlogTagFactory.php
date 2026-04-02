<?php

namespace Database\Factories;

use App\Models\BlogTag;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BlogTag>
 */
class BlogTagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'blog_id' => \App\Models\Blog::factory(),
            'tag' => fake()->word(),
            'tag_id' => fake()->word(),
        ];
    }
}
