<?php

use App\Models\Category;

test('can list categories', function () {
    Category::factory()->count(3)->create();

    $response = $this->getJson('/api/categories');

    $response->assertOk()
        ->assertJsonCount(3, 'data');
});

test('can show category by slug', function () {
    $category = Category::factory()->create(['slug' => 'living-room']);

    $response = $this->getJson('/api/categories/living-room');

    $response->assertOk()
        ->assertJsonPath('data.slug', 'living-room');
});

test('show category returns 404 for invalid slug', function () {
    $response = $this->getJson('/api/categories/non-existent');

    $response->assertNotFound();
});
