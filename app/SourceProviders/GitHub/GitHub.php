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
        // Get the list of ssh keys and check if the key exists
        $keys = $this->client->get('/user/keys');
                    
        $keys = json_decode($keys->getBody(true)->getContents());

        $keyFound = false;

        if (is_array($keys)) {
            foreach ($keys as $key) {
                if ($key->title === 'ServerDesk ('.$server->name.')') {
                    $this->sourceProvider->source_provider_ssh_key_id = $key->id;
                    $this->sourceProvider->save();
                    $keyFound = true;
                    break;
                }
            }
        }

        if ($keyFound === false) {
            try {
                $response = $this->client->post('/user/keys', [
                    'json' => [
                        'title' => 'ServerDesk ('.$server->name.')',
                        'key' => $server->credential->public_key
                    ]
                ]);
    
                $response = json_decode($response->getBody(true)->getContents());
    
                if (is_object($response)) {
                    $this->sourceProvider->source_provider_ssh_key_id = $response->id;
                    $this->sourceProvider->save();
                }
            } catch (\Exception $e) {
                \Log::info($e);
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