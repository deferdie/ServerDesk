<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Requests\UserUpdateRequest;

class UserController extends Controller
{
    /**
     * Show the authenticated user
     *
     * @param Request $request
     * @return void
     */
    public function show(Request $request)
    {
        return new UserResource($request->user());
    }

    /**
     * Update the authenticated user
     *
     * @return void
     */
    public function update(UserUpdateRequest $request)
    {
        if ($request->has('welcome_completed')) {
            if ($request->welcome_completed === true) {
                // Check if the user has a source provider
                // Check if the user has a server provider
            }
        }
    }
}
