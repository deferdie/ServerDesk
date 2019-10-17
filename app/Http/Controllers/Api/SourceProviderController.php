<?php

namespace App\Http\Controllers\Api;

use App\SourceProvider;
use App\Http\Controllers\Controller;
use App\Http\Resources\SourceProviderResource;

class SourceProviderController extends Controller
{
    /**
     * Returns all of the source providers
     *
     * @return void
     */
    public function index()
    {
        return SourceProviderResource::collection(
            SourceProvider::all()
        );
    }
}
