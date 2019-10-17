<?php

namespace App\Http\Controllers\Api;

use GuzzleHttp\Client;
use App\SourceProvider;
use App\UserSourceProvider;
use App\Http\Controllers\Controller;
use App\Http\Requests\GitHubConnectorRequest;
use App\Http\Resources\SourceProviderResource;

class GitHubConnectorController extends Controller
{
    /**
     * Connect an the user to GitHub using the provided authorisation token
     *
     * @return void
     */
    public function connect(GitHubConnectorRequest $request)
    {
        $sourceProvider = SourceProvider::whereName('GitHub')->first();

        $userSourceProvider = UserSourceProvider::firstOrCreate([
            'user_id' => auth()->user()->id,
            'source_provider_id' => $sourceProvider->id
        ]);

        if ($userSourceProvider->access_token === null) {
            // Create a source provider credential for the user
            $client = new Client();
    
            $resp = $client->request('POST', 'https://github.com/login/oauth/access_token', [
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
                foreach($params as $key => $value) {
                    if ($value === 'access_token') {
                        $accesToken = $params[$key + 1];
                        break;
                    }
                }
            }

            $userSourceProvider->access_token = $accesToken;
            $userSourceProvider->save();
        }
        return SourceProviderResource::collection(SourceProvider::all());
    }
}
