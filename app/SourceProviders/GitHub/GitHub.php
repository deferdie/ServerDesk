<?php

namespace App\SourceProviders\GitHub;

use App\Application;
use App\Server;
use GuzzleHttp\Client;
use App\UserSourceProvider;
use GuzzleHttp\Exception\ClientException;

class GitHub
{
    /**
     * The client that makes requests to the GitHub API
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
     * Bootstraps the class
     */
    public function __construct(UserSourceProvider $sourceProvider)
    {
        $this->sourceProvider = $sourceProvider;

        $this->client = new Client([
            'base_uri' => 'https://api.github.com',
            'headers' => [
                'Authorization' => 'token '. $sourceProvider->access_token
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
    public function createSSHKey(Server $server)
    {
        if (! $this->sourceProvider->source_provider_ssh_key_id) {
            // Create the key
            try {
                $response = $this->client->post('/user/keys', [
                    'json' => [
                        'title' => 'ServerDesk',
                        'key' => $server->credential->public_key
                    ]
                ]);

                $response = json_decode($response->getBody(true)->getContents());

                if (is_object($response)) {
                    $this->sourceProvider->source_provider_ssh_key_id = $response->id;
                    $this->sourceProvider->save();
                }

            } catch (ClientException $e) {
                if ($e->hasResponse() && $e->getResponse()->getStatusCode() === 422) {
                    // Get the list of ssh keys
                    $keys = $this->client->get('/user/keys');
                    
                    $keys = json_decode($keys->getBody(true)->getContents());

                    if (is_array($keys)) {
                        foreach ($keys as $key) {
                            if ($key->title === 'ServerDesk') {
                                $this->sourceProvider->source_provider_ssh_key_id = $key->id;
                                $this->sourceProvider->save();
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Clonse a repository to a given server
     *
     * @return void
     */
    public function cloneRepository(Server $server, Application $application)
    {
        $server->exec(
            view('scripts.deployments.github-deployment', [
                'application' => $application
            ])->render()
        );
    }
}