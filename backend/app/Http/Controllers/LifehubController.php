<?php

namespace App\Http\Controllers;

use App\Models\Lifehub;
use Illuminate\Http\Request;

class LifehubController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Lifehub::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            "name" => "string|required|max:255",
            "category" => "string|required|max:255",
            "status" => "boolean",
            "date" => "date"
        ]);

        $data['status'] ??= false;

        $task = Lifehub::create($data);

        return response()->json([
            "message" => "Lifehub row created successfully.",
            "data" => $task
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = Lifehub::findOrFail($id);
        return response()->json($task);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lifehub $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, string $id)
    {
        $request->validate([
            "name" => "sometimes|string|max:255",
            "category" => "sometimes|string|max:255",
            "status" => "sometimes|boolean",
            "date" => "sometimes|date"
        ]);

        $task = Lifehub::findOrFail($id);
        $original = clone $task;

        $task->update($request->all());

        return response()->json([
            "message" => "Lifehub row $id updated successfully.",
            "original" => $original,
            "new" => $task
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = Lifehub::findOrFail($id);
        $task->delete();
        return response()->json([
            "message" => "Lifehub row deleted successfully.",
            "data" => $task
        ], 200);
    }
}
