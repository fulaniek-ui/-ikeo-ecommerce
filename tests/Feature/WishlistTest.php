<?php

use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'user']);
    $this->actingAs($this->user, 'sanctum');
});

test('can list wishlist', function () {
    $product = Product::factory()->create();
    Wishlist::create(['user_id' => $this->user->id, 'product_id' => $product->id]);

    $response = $this->getJson('/api/wishlist');

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

test('can add product to wishlist', function () {
    $product = Product::factory()->create();

    $response = $this->postJson('/api/wishlist', ['product_id' => $product->id]);

    $response->assertCreated()
        ->assertJsonPath('wishlisted', true);

    $this->assertDatabaseHas('wishlists', [
        'user_id' => $this->user->id,
        'product_id' => $product->id,
    ]);
});

test('can remove product from wishlist by toggling', function () {
    $product = Product::factory()->create();
    Wishlist::create(['user_id' => $this->user->id, 'product_id' => $product->id]);

    $response = $this->postJson('/api/wishlist', ['product_id' => $product->id]);

    $response->assertOk()
        ->assertJsonPath('wishlisted', false);

    $this->assertDatabaseMissing('wishlists', [
        'user_id' => $this->user->id,
        'product_id' => $product->id,
    ]);
});

test('wishlist toggle requires valid product_id', function () {
    $response = $this->postJson('/api/wishlist', ['product_id' => 9999]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('product_id');
});

test('wishlist requires authentication', function () {
    $this->app['auth']->forgetGuards();

    $this->getJson('/api/wishlist')->assertUnauthorized();
    $this->postJson('/api/wishlist', [])->assertUnauthorized();
});
