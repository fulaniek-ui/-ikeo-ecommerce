<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultationController extends Controller
{
    public function index(Request $request)
    {
        $consultations = Consultation::with('user', 'store')
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('consultation/index', [
            'consultations' => $consultations,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function show(Consultation $consultation)
    {
        return Inertia::render('consultation/show', [
            'consultation' => $consultation->load('user', 'store'),
        ]);
    }

    public function update(Request $request, Consultation $consultation)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,confirmed,completed,cancelled'],
        ]);

        $consultation->update($data);

        return redirect()->route('consultations.index');
    }
}
