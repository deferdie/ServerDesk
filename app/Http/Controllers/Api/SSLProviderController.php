<?php

namespace App\Http\Controllers\Api;

use App\SSLProvider;
use App\Http\Controllers\Controller;
use App\Http\Resources\SSLProviderResource;

class SSLProviderController extends Controller
{
    /**
     * Returns all of the ssl providers
     *
     * @return void
     */
    public function index()
    {
        return SSLProviderResource::collection(SSLProvider::all());
    }
}
