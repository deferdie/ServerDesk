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
     * Returns a the region for the given region id
     *
     * @param integer $regionID
     * @return void
     */
    public function getRegion(int $regionID)
    {
        try {
            $response = $this->client->get('regions/list');
            
            foreach (json_decode($response->getBody()->getContents()) as $region) {
                \Log::info(json_encode($region));
                if ($region->DCID === $regionID) {
                    return $region;
                }
            }

        } catch (\Exception $e) {
            \Log::info($e);
        }
    }
    
    /**
     * Gets the os id for Ubuntu 18
     *
     * @param integer $regionID
     * @return int
     */
    public function getOsId()
    {
        try {
            $response = $this->client->get('os/list');
            
            foreach (json_decode($response->getBody()->getContents()) as $os) {
                if ($os->name == 'Ubuntu 18.04 x64') {
                    return $os->OSID;
                }
            }
            
            return 270;

        } catch (\Exception $e) {
            \Log::info($e);
        }
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
     * Gets a plan
     *
     * @param integer $planId
     * @return void
     */
    public function getPlan(int $planId)
    {
        try {
            $response = $this->client->get('plans/list?type=vc2');

            foreach (json_decode($response->getBody()->getContents()) as $plan) {
                if ($plan->VPSPLANID == $planId) {
                    return $plan;
                }
            }
        } catch (\Exception $e) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'plans' => ['Could not get plans']
            ]);
        }
    }
    
    /**
     * Creates a server
     *
     * @param integer $plan
     * @param integer $region
     * @param integer $osId
     * @param integer $scriptId
     * @param integer $sshKeyId
     * @param string $label
     * @return void
     */
    public function createServer($plan, $region, $osId, $scriptId, $sshKeyId, $label)
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

            return json_decode($response->getBody()->getContents());
        } catch (\Exception $e) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'plans' => ['Could not create server']
            ]);
        }
    }
    
    /**
     * Creates a script
     *
     * @param string $name
     * @param string $script
     * @return void
     */
    public function createScript(string $name, string $script)
    {
        try {
            $response = $this->client->post('startupscript/create', [
                'form_params' => [
                    'name' => $name,
                    'script' => $script
                ]
            ]);

            return json_decode($response->getBody()->getContents());
        } catch (\Exception $e) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'plans' => ['Could not create server']
            ]);
        }
    }
    
    /**
     * Deletes a server
     *
     * @param integer $serverId
     * @return void
     */
    public function deleteServer(int $serverId)
    {
        try {
            $this->client->post('server/destroy', [
                'form_params' => [
                    'SUBID' => $serverId,
                ]
            ]);
        } catch (\Exception $e) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'plans' => ['Could not delete server']
            ]);
        }
    }
    
    /**
     * Deletes a script
     *
     * @return void
     */
    public function deleteScript(int $scriptId)
    {
        try {
            $this->client->post('startupscript/destroy', [
                'form_params' => [
                    'SCRIPTID' => $scriptId,
                ]
            ]);
        } catch (\Exception $e) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'plans' => ['Could not delete script']
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
