<?php

use App\Models\Brand;

test('can list brands', function () {
    Brand::factory()->count(3)->create();

    $response = $this->getJson('/api/brands');

    $response->assertOk()
        ->assertJsonCount(3, 'data');
});

test('can show brand by slug', function () {
    $brand = Brand::factory()->create(['slug' => 'ikea']);

    $response = $this->getJson('/api/brands/ikea');

    $response->assertOk()
        ->assertJsonPath('data.slug', 'ikea');
});

test('show brand returns 404 for invalid slug', function () {
    $response = $this->getJson('/api/brands/non-existent');

    $response->assertNotFound();
});
