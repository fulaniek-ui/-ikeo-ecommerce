<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;

test('can list products', function () {
    Product::factory()->count(3)->create();

    $response = $this->getJson('/api/products');

    $response->assertOk()
        ->assertJsonStructure(['data' => ['products', 'filters'], 'meta', 'links']);
});

test('can show product by slug', function () {
    $product = Product::factory()->create(['slug' => 'test-product']);

    $response = $this->getJson('/api/products/test-product');

    $response->assertOk()
        ->assertJsonPath('data.slug', 'test-product');
});

test('show product returns 404 for invalid slug', function () {
    $response = $this->getJson('/api/products/non-existent');

    $response->assertNotFound();
});

test('can filter products by category', function () {
    $category = Category::factory()->create(['slug' => 'chairs']);
    Product::factory()->count(2)->create(['category_id' => $category->id]);
    Product::factory()->create(); // different category

    $response = $this->getJson('/api/products?category=chairs');

    $response->assertOk()
        ->assertJsonCount(2, 'data.products');
});

test('can filter products by brand', function () {
    $brand = Brand::factory()->create(['slug' => 'ikea']);
    Product::factory()->count(2)->create(['brand_id' => $brand->id]);
    Product::factory()->create(); // different brand

    $response = $this->getJson('/api/products?brand=ikea');

    $response->assertOk()
        ->assertJsonCount(2, 'data.products');
});

test('can search products by name', function () {
    Product::factory()->create(['name' => 'UniqueWoodenChairXYZ']);
    Product::factory()->create(['name' => 'MetalTableABC']);

    $response = $this->getJson('/api/products?search=UniqueWoodenChairXYZ');

    $response->assertOk()
        ->assertJsonCount(1, 'data.products');
});
