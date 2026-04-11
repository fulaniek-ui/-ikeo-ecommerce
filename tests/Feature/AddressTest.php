<?php

use App\Models\Address;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'user']);
    $this->actingAs($this->user, 'sanctum');
});

test('can list own addresses', function () {
    Address::factory()->count(2)->create(['user_id' => $this->user->id]);

    $response = $this->getJson('/api/addresses');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

test('can create address', function () {
    $response = $this->postJson('/api/addresses', [
        'label' => 'Home',
        'recipient_name' => 'John Doe',
        'phone' => '08123456789',
        'address' => 'Jl. Test No. 1',
        'city' => 'Jakarta',
        'province' => 'DKI Jakarta',
        'postal_code' => '12345',
        'is_default' => true,
    ]);

    $response->assertCreated()
        ->assertJsonPath('message', 'Address created');

    $this->assertDatabaseHas('addresses', ['label' => 'Home', 'user_id' => $this->user->id]);
});

test('can update own address', function () {
    $address = Address::factory()->create(['user_id' => $this->user->id]);

    $response = $this->putJson("/api/addresses/{$address->id}", [
        'label' => 'Office',
        'recipient_name' => 'Jane Doe',
        'phone' => '08123456789',
        'address' => 'Jl. Updated No. 2',
        'city' => 'Bandung',
        'province' => 'Jawa Barat',
        'postal_code' => '54321',
    ]);

    $response->assertOk()
        ->assertJsonPath('message', 'Address updated');
});

test('cannot update other user address', function () {
    $otherUser = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->putJson("/api/addresses/{$address->id}", [
        'label' => 'Hack',
        'recipient_name' => 'Hacker',
        'phone' => '000',
        'address' => 'Nowhere',
        'city' => 'X',
        'province' => 'X',
        'postal_code' => '00000',
    ]);

    $response->assertForbidden();
});

test('can delete own address', function () {
    $address = Address::factory()->create(['user_id' => $this->user->id]);

    $response = $this->deleteJson("/api/addresses/{$address->id}");

    $response->assertOk()
        ->assertJsonPath('message', 'Address deleted');

    $this->assertDatabaseMissing('addresses', ['id' => $address->id]);
});

test('cannot delete other user address', function () {
    $otherUser = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->deleteJson("/api/addresses/{$address->id}");

    $response->assertForbidden();
});

test('address endpoints require authentication', function () {
    // Reset auth
    $this->app['auth']->forgetGuards();

    $this->getJson('/api/addresses')->assertUnauthorized();
    $this->postJson('/api/addresses', [])->assertUnauthorized();
});

test('create address validates required fields', function () {
    $response = $this->postJson('/api/addresses', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['label', 'recipient_name', 'phone', 'address', 'city', 'province', 'postal_code']);
});
