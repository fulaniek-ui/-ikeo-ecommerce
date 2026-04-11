<?php

use App\Models\User;

test('user can register via api', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'apitest@gmail.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['data', 'token', 'message']);

    $this->assertDatabaseHas('users', ['email' => 'apitest@gmail.com']);
});

test('register fails with duplicate email', function () {
    User::factory()->create(['email' => 'taken@gmail.com']);

    $response = $this->postJson('/api/register', [
        'name' => 'Test',
        'email' => 'taken@gmail.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

test('register validates required fields', function () {
    $response = $this->postJson('/api/register', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

test('user can login via api', function () {
    User::factory()->create([
        'email' => 'logintest@gmail.com',
        'password' => bcrypt('password'),
        'role' => 'user',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'logintest@gmail.com',
        'password' => 'password',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['data', 'token']);
});

test('login fails with wrong password', function () {
    User::factory()->create([
        'email' => 'user@gmail.com',
        'password' => bcrypt('password'),
        'role' => 'user',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'user@gmail.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertUnauthorized()
        ->assertJsonPath('message', 'Invalid credentials');
});

test('login fails for non-user role', function () {
    User::factory()->create([
        'email' => 'admin@gmail.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'admin@gmail.com',
        'password' => 'password',
    ]);

    $response->assertForbidden()
        ->assertJsonPath('message', 'This account is not a customer');
});

test('user can logout', function () {
    $user = User::factory()->create(['role' => 'user']);
    $token = $user->createToken('api-token')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/logout');

    $response->assertOk()
        ->assertJsonPath('message', 'Logout success');
});

test('user can get profile', function () {
    $user = User::factory()->create(['role' => 'user']);
    $this->actingAs($user, 'sanctum');

    $response = $this->getJson('/api/profile');

    $response->assertOk()
        ->assertJsonPath('data.email', $user->email);
});

test('user can update profile', function () {
    $user = User::factory()->create(['role' => 'user']);
    $this->actingAs($user, 'sanctum');

    $response = $this->postJson('/api/profile', [
        'name' => 'Updated Name',
        'phone' => '08999999999',
    ]);

    $response->assertOk()
        ->assertJsonPath('message', 'Profile updated');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
        'phone' => '08999999999',
    ]);
});

test('profile endpoints require authentication', function () {
    $this->getJson('/api/profile')->assertUnauthorized();
    $this->postJson('/api/profile', [])->assertUnauthorized();
    $this->postJson('/api/logout')->assertUnauthorized();
});
