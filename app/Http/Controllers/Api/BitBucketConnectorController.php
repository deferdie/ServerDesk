<?php

namespace App\Http\Controllers\Api;

use GuzzleHttp\Client;
use App\SourceProvider;
use App\UserSourceProvider;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Http\Requests\BitBucketConnectorRequest;
use App\Http\Resources\UserSourceProviderResource;

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
            'key' => Str::random(),
            'name' => "ServerDesk",
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

        $userSourceProvider = UserSourceProvider::firstOrCreate([
            'user_id' => auth()->user()->id,
            'source_provider_id' => $sourceProvider->id
        ]);

        if ($userSourceProvider->access_token === null) {
            // Create a source provider credential for the user
            $client = new Client();

            $resp = $client->request('POST', 'https://bitbucket.org/site/oauth2/access_token', [
                'query' => [
                    'code' => $request->code,
                    'state' => $request->state,
                    'redirect_uri' => env('GITHUB_REDIRECT_URI'),
                    'client_id' => env('GITHUB_CLIENT_ID'),
                    'client_secret' => env('GITHUB_CLIENT_SECRET'),
                ]
            ]);

            $accesToken = null;

            // Find the access token
            foreach (explode('&', $resp->getBody()->getContents()) as $responseTokens) {
                $params = explode('=', $responseTokens);
                foreach ($params as $key => $value) {
                    if ($value === 'access_token') {
                        $accesToken = $params[$key + 1];
                        break;
                    }
                }
            }

            $userSourceProvider->access_token = $accesToken;
            $userSourceProvider->save();

            return new UserSourceProviderResource($userSourceProvider->fresh());
        }
    }
}
