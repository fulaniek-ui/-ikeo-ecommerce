<?php

use App\Models\Address;
use App\Models\Order;
use App\Models\User;

test('webhook marks order as processing when paid', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'address_id' => $address->id,
        'order_number' => 'IKEO-TEST1234',
        'status' => 'pending',
    ]);

    $response = $this->postJson('/api/payments/webhook', [
        'external_id' => 'IKEO-TEST1234',
        'status' => 'PAID',
    ], ['x-callback-token' => config('services.xendit.webhook_token')]);

    $response->assertOk()
        ->assertJsonPath('message', 'Webhook processed');

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'processing',
    ]);
});

test('webhook marks order as cancelled when expired', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'address_id' => $address->id,
        'order_number' => 'IKEO-EXPIRED1',
        'status' => 'pending',
    ]);

    $response = $this->postJson('/api/payments/webhook', [
        'external_id' => 'IKEO-EXPIRED1',
        'status' => 'EXPIRED',
    ], ['x-callback-token' => config('services.xendit.webhook_token')]);

    $response->assertOk();

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'cancelled',
    ]);
});

test('webhook returns 404 for unknown order', function () {
    $response = $this->postJson('/api/payments/webhook', [
        'external_id' => 'IKEO-UNKNOWN',
        'status' => 'PAID',
    ], ['x-callback-token' => config('services.xendit.webhook_token')]);

    $response->assertNotFound();
});

test('webhook rejects invalid callback token', function () {
    $response = $this->postJson('/api/payments/webhook', [
        'external_id' => 'IKEO-TEST',
        'status' => 'PAID',
    ], ['x-callback-token' => 'invalid-token']);

    $response->assertUnauthorized();
});

test('payment success endpoint returns message', function () {
    $response = $this->getJson('/api/payments/success?order=1');

    $response->assertOk()
        ->assertJsonPath('message', 'Payment successful');
});

test('payment failure endpoint returns message', function () {
    $response = $this->getJson('/api/payments/failure?order=1');

    $response->assertOk()
        ->assertJsonPath('message', 'Payment failed or cancelled');
});
