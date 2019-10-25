<?php

namespace App\Http\Controllers\Api;

use App\User;
use App\Mail\TeamWelcomeMail;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Mail;
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

    /**
     * Create a new team member
     *
     * @param TeamStoreRequest $request
     * @return void
     */
    public function store(TeamStoreRequest $request)
    {
        $user = User::create([
            'active' => false,
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt(rand(10, 38848)),
            'parent_user_id' => auth()->user()->id,
        ]);

        // Send a welcome email to activa the account
        Mail::to($user)->send(new TeamWelcomeMail($user));

        return new UserResource($user);
    }
}
