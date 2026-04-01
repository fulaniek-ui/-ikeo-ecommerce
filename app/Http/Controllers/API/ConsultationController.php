<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'store_id' => ['nullable', 'exists:stores,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'preferred_date' => ['required', 'date', 'after:today'],
            'message' => ['nullable', 'string'],
        ]);

        if ($request->user()) {
            $data['user_id'] = $request->user()->id;
        }

        $consultation = Consultation::create($data);

        return response()->json(['data' => $consultation, 'message' => 'Consultation booked'], 201);
    }
}
