<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserSourceProviderResource;
use App\UserSourceProvider;

class UserSourceProviderController extends Controller
{
    /**
     * Gets the source providers for all users
     */
    public function index()
    {
        return UserSourceProviderResource::collection(
            UserSourceProvider::where('user_id', auth()->user()->id)->get()
        );
    }
}
