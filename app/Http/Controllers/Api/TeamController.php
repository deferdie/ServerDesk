<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Requests\TeamStoreRequest;

class TeamController extends Controller
{
    /**
     * Returns all of the users team members
     *
     * @return void
     */
    public function index()
    {
        $team = auth()->user()->team();
        return UserResource::collection($team);
    }

    public function store(TeamStoreRequest $request)
    {
        // Store the user
    }
}
