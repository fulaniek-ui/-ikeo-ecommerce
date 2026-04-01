<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        NewsletterSubscriber::updateOrCreate(
            ['email' => $request->email],
            ['is_active' => true],
        );

        return response()->json(['message' => 'Subscribed successfully']);
    }
}
