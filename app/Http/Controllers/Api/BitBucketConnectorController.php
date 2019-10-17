<?php

namespace App\Http\Controllers\Api;

use GuzzleHttp\Client;
use App\SourceProvider;
use App\UserSourceProvider;
use App\Http\Controllers\Controller;
use App\Http\Resources\SourceProviderResource;
use App\Http\Requests\BitBucketConnectorRequest;

class BitBucketConnectorController extends Controller
{
    /**
     * Initialise the connector between BitBucket
     * 
     * This is only used during the app creation process for BitBUcket
     *
     * @return void
     */
    public function init()
    {
        return response()->json([
            'name' => "ServerDesk",
            'key' => env('BITBUCKET_KEY'),
            'baseUrl' => env('BITBUCKET_BASE_URI'),
            'description' => "ServerDesk connector for BitBucket"
        ]);
    }

    /**
     * Connect the user to BitBucket using the provided authorisation token
     *
     * @return void
     */
    public function connect(BitBucketConnectorRequest $request)
    {
        $sourceProvider = SourceProvider::whereName('BitBucket')->first();

        UserSourceProvider::firstOrCreate([
            'user_id' => auth()->user()->id,
            'source_provider_id' => $sourceProvider->id,
            'access_token' => $request->access_token
        ]);

        return SourceProviderResource::collection(SourceProvider::all());
    }
}
