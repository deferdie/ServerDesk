<?php

namespace App\SourceProviders\BitBucket;

use App\Application;
use App\Server;
use GuzzleHttp\Client;
use App\UserSourceProvider;
use GuzzleHttp\Exception\ClientException;

class BitBucket
{
    /**
     * The client that makes requests to the BitBucket API
     *
     * @var Client
     */
    protected $client;

    /**
     * The source provider credentials for this provider
     *
     * @var UserSourceProvider
     */
    protected $sourceProvider;

    /**
     * The maximum amount of retries for any given request
     *
     * @var integer
     */
    protected $maxRetries = 5;
    
    /**
     * The current retry count
     *
     * @var integer
     */
    protected $retries = 0;

    /**
     * Bootstraps the class
     */
    public function __construct(UserSourceProvider $sourceProvider)
    {
        $this->sourceProvider = $sourceProvider;

        $this->client = new Client([
            'base_uri' => 'https://api.bitbucket.org/2.0/',
            'headers' => [
                'Authorization' => 'Bearer  ' . $sourceProvider->access_token
            ]
        ]);
    }

    /**
     * Creates an SSH if one does not exist for a server
     *
     * @return void
     */
    public function getOrCreateSSHKey(Server $server)
    {
        if (! $this->sourceProvider->source_provider_ssh_key_id) {
            // Create the key
            $response = $this->client->post('/user/keys', [
                'json' => [
                    'title' => 'ServerDesk',
                    'key' => $server->credential->public_key
                ]
            ]);

            $response = $response->getBody()->getContents();

            if (isset($response->id)) {
                $this->sourceProvider->source_provider_ssh_key_id = $response->id;
                $this->sourceProvider->save();
            }

            return $response;
        }

        // Get the key
        $response = $this->client->get('/user/keys/' . $this->sourceProvider->source_provider_ssh_key_id);

        return $response->getBody()->getContents();
    }
    
    /**
     * Creates an SSH if one does not exist for a server
     *
     * @return void
     */
    public function cloneRepository(Server $server, Application $application)
    {
        try {
            $this->getUser();

            $result = $server->exec(
                view('scripts.deployments.bitbucket-deployment', [
                    'application' => $application,
                    'access_token' => $this->sourceProvider->access_token
                ])->render()
            );

            \Log::info($result->output);
            
        } catch (ClientException $e) {
            if ($e->getResponse()->getStatusCode() === 401) {
                if ($this->retries <= $this->maxRetries) {
                    $this->retries = $this->retries + 1;
                    $this->refreshToken();
                }
            }
        }
    }
    
    /**
     * Gets the user
     *
     * @return void
     */
    public function getUser()
    {
        return $this->request(function() {
            return $this->client->get('user/');
        });
    }

    /**
     * Refresh the access token
     *
     * @return void
     */
    public function refreshToken()
    {
        $client = new Client();

        try {
            $resp = $client->request('POST', 'https://bitbucket.org/site/oauth2/access_token', [
                'auth' => [
                    env('BITBUCKET_CLIENT_ID'),
                    env('BITBUCKET_SECRET')
                ],
                'form_params' => [
                    'grant_type' => 'refresh_token',
                    "refresh_token" => $this->sourceProvider->refresh_token
                ]
            ]);

            $resp = json_decode($resp->getBody()->getContents());

            $this->sourceProvider->access_token = $resp->access_token;
            $this->sourceProvider->refresh_token = $resp->refresh_token;
            $this->sourceProvider->save();

        } catch (\Exception $e) {
            \Log::info($e);
        }
    }

    /**
     * Makes the request to the BitBucket api
     *
     * @return void
     */
    private function request($request)
    {
        try {
            return json_decode($request()->getBody()->getContents());
            $this->retries = 0;
        } catch (ClientException $e) {
            if ($e->hasResponse()) {
                if ($e->getResponse()->getStatusCode() === 401) {
                    if ($this->retries <= $this->maxRetries) {
                        $this->retries = $this->retries + 1;
                        $this->refreshToken();
                        // Retry the original request
                        $this->request($request);
                    }
                }
            }

        } catch (\Exception $e) {
            \Log::info($e);
        }
    }
}