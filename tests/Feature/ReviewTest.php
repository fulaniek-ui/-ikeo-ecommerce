<?php

use App\Models\Product;
use App\Models\Review;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'user']);
    $this->actingAs($this->user, 'sanctum');
});

test('can submit review', function () {
    $product = Product::factory()->create();

    $response = $this->postJson('/api/reviews', [
        'product_id' => $product->id,
        'rating' => 5,
        'comment' => 'Great product!',
    ]);

    $response->assertCreated()
        ->assertJsonPath('message', 'Review submitted');

    $this->assertDatabaseHas('reviews', [
        'user_id' => $this->user->id,
        'product_id' => $product->id,
        'rating' => 5,
    ]);
});

test('cannot submit duplicate review for same product', function () {
    $product = Product::factory()->create();
    Review::create([
        'user_id' => $this->user->id,
        'product_id' => $product->id,
        'rating' => 4,
        'comment' => 'First review',
    ]);

    $response = $this->postJson('/api/reviews', [
        'product_id' => $product->id,
        'rating' => 5,
        'comment' => 'Second review',
    ]);

    $response->assertUnprocessable()
        ->assertJsonPath('message', 'You already reviewed this product');
});

test('review validates required fields', function () {
    $response = $this->postJson('/api/reviews', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['product_id', 'rating']);
});

test('review rating must be between 1 and 5', function () {
    $product = Product::factory()->create();

    $this->postJson('/api/reviews', [
        'product_id' => $product->id,
        'rating' => 0,
    ])->assertUnprocessable()->assertJsonValidationErrors('rating');

    $this->postJson('/api/reviews', [
        'product_id' => $product->id,
        'rating' => 6,
    ])->assertUnprocessable()->assertJsonValidationErrors('rating');
});

test('review requires authentication', function () {
    $this->app['auth']->forgetGuards();

    $this->postJson('/api/reviews', [])->assertUnauthorized();
});
