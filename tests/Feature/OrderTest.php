<?php

use App\Models\Address;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\XenditService;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'user']);
    $this->actingAs($this->user, 'sanctum');
});

test('can list own orders', function () {
    Order::factory()->count(2)->create(['user_id' => $this->user->id]);

    $response = $this->getJson('/api/orders');

    $response->assertOk()
        ->assertJsonStructure(['data']);
});

test('can show own order', function () {
    $address = Address::factory()->create(['user_id' => $this->user->id]);
    $order = Order::factory()->create([
        'user_id' => $this->user->id,
        'address_id' => $address->id,
    ]);

    $response = $this->getJson("/api/orders/{$order->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $order->id);
});

test('cannot show other user order', function () {
    $otherUser = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $otherUser->id]);
    $order = Order::factory()->create([
        'user_id' => $otherUser->id,
        'address_id' => $address->id,
    ]);

    $response = $this->getJson("/api/orders/{$order->id}");

    $response->assertForbidden();
});

test('can create order with mocked xendit', function () {
    $mock = Mockery::mock(XenditService::class);
    $mock->shouldReceive('createInvoice')->once()->andReturn([
        'id' => 'inv_fake_123',
        'invoice_url' => 'https://checkout.xendit.co/fake',
    ]);
    $this->app->instance(XenditService::class, $mock);

    $address = Address::factory()->create(['user_id' => $this->user->id]);
    $product = Product::factory()->create(['price' => 100000]);

    $response = $this->postJson('/api/orders', [
        'address_id' => $address->id,
        'payment_method' => 'transfer',
        'courier' => 'JNE',
        'items' => [
            ['product_id' => $product->id, 'quantity' => 2],
        ],
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['data', 'payment_url', 'message']);

    $this->assertDatabaseHas('orders', ['user_id' => $this->user->id]);
});

test('create order validates required fields', function () {
    $response = $this->postJson('/api/orders', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['address_id', 'payment_method', 'courier', 'items']);
});

test('order endpoints require authentication', function () {
    $this->app['auth']->forgetGuards();

    $this->getJson('/api/orders')->assertUnauthorized();
    $this->postJson('/api/orders', [])->assertUnauthorized();
});
