<?php

namespace App\Http\Controllers\Api;

use App\ServerProvider;
use App\Http\Controllers\Controller;
use App\Http\Resources\ServerProviderResource;

class ServerProviderController extends Controller
{
    /**
     * Returns all of the server providers
     *
     * @return void
     */
    public function index()
    {
        return ServerProviderResource::collection(
            ServerProvider::all()
        );
    }
}
