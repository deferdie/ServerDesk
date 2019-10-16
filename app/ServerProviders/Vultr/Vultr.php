<?php

namespace App\ServerProviders\Vultr;

use App\Http\Requests\ServerStoreRequest;
use App\Server;
use GuzzleHttp\Client;
use App\UserServerProviderCredential;

class Vultr
{
    /**
     * The Client which will interact with Vultr
     *
     * @var Client
     */
    public $client;

    /**
     * A proxy for the DigitalOceanV2
     *
     * @param \App\UserServerProviderCredential $UserServerProviderCredential
     */
    public function __construct(UserServerProviderCredential $credential)
    {
        $this->client = new Client([
            'base_uri' => 'https://api.vultr.com/v1/',
            'headers' => [
                'API-Key' => $credential->key,
                'Accept' => 'application/json',
                'Content-Type' => 'application/x-www-form-urlencoded',
            ]
        ]);
    }

    /**
     * Gets the avaliable plans for this provider
     *
     * @return void
     */
    public function getPlans()
    {
        try {
            $response = $this->client->get('plans/list?type=vc2');
            return $response->getBody()->getContents();
        } catch (\Exception $e) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'plans' => ['Could not get plans']
            ]);
        }
    }
    
    /**
     * Creates a server
     *
     * @return void
     */
    public function createServer(int $plan, int $region, int $osId, int $scriptId, int $sshKeyId, string $label)
    {
        try {
            $response = $this->client->post('server/create', [
                'form_params' => [
                    // The region
                    'DCID' => $region,
                    // The plan to use to create the server
                    'VPSPLANID' => $plan,
                    // The operation system id for the server
                    'OSID' => $osId,
                    // The script id, this script will run on startup
                    'SCRIPTID' => $scriptId,
                    // The label for the server
                    'label' => $label,
                    // The SSH keyid for the server
                    'SSHKEYID' => $sshKeyId
                ]
            ]);

            return $response->getBody()->getContents();
        } catch (\Exception $e) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'plans' => ['Could not create server']
            ]);
        }
    }

    /**
     * Attaches a public key to the provider
     *
     * @param UserServerProviderCredential $credential
     * @return void
     */
    public function attachPublicKey(UserServerProviderCredential $credential)
    {
        try {
            $response = $this->client->post('sshkey/create', [
                'form_params' => [
                    'name' => 'ServerDesk',
                    'ssh_key' => $credential->public_key
                ]
            ]);

            $credential->server_provider_key_id = json_decode($response->getBody()->getContents())->SSHKEYID;
            $credential->save();

            return $credential;
        } catch (\Exception $e) {
            $credential->delete();

            throw \Illuminate\Validation\ValidationException::withMessages([
                'key' => ['The provider could not authenticate the key you provided']
            ]);
        }
    }
    
    /**
     * Removes a public key from the provider
     *
     * @param UserServerProviderCredential $credential
     * @return void
     */
    public function deletePublicKey(UserServerProviderCredential $credential)
    {
        try {
            $this->client->post('sshkey/destroy', [
                'form_params' => [
                    'SSHKEYID' => $credential->server_provider_key_id
                ]
            ]);

            $credential->server_provider_key_id = null;
            $credential->save();

            return $credential;
        } catch (\Exception $e) {
            $credential->delete();

            throw \Illuminate\Validation\ValidationException::withMessages([
                'key' => ['The provider could not authenticate the key you provided']
            ]);
        }
    }
}
