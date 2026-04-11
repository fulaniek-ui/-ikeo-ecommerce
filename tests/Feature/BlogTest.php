<?php

use App\Models\Blog;

test('can list published blogs', function () {
    Blog::factory()->count(2)->create(['published_at' => now()]);
    Blog::factory()->create(['published_at' => null]); // unpublished

    $response = $this->getJson('/api/blogs');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

test('can show published blog by slug', function () {
    $blog = Blog::factory()->create(['slug' => 'test-blog', 'published_at' => now()]);

    $response = $this->getJson('/api/blogs/test-blog');

    $response->assertOk()
        ->assertJsonPath('data.slug', 'test-blog');
});

test('show blog returns 404 for unpublished blog', function () {
    Blog::factory()->create(['slug' => 'draft-blog', 'published_at' => null]);

    $response = $this->getJson('/api/blogs/draft-blog');

    $response->assertNotFound();
});

test('show blog returns 404 for invalid slug', function () {
    $response = $this->getJson('/api/blogs/non-existent');

    $response->assertNotFound();
});
