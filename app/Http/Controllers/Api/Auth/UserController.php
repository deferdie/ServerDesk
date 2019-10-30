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
                $user = auth()->user();
                if (count($user->sourceProviders) > 0 && count($user->serverProviders) > 0) {
                    $user->welcome_completed = true;
                    $user->save();
                }
            }
        }
    }
}
