<?php

namespace App\ServerProviders\DigitalOcean;

use DigitalOceanV2\DigitalOceanV2;
use App\UserServerProviderCredential;
use DigitalOceanV2\Adapter\GuzzleHttpAdapter;

class DigitalOcean extends DigitalOceanV2
{
    /**
     * A proxy for the DigitalOceanV2
     *
     * @param \App\UserServerProviderCredential $UserServerProviderCredential
     */
    public function __construct(UserServerProviderCredential $credential)
    {
        $adapter = new GuzzleHttpAdapter($credential->key);
        parent::__construct($adapter);
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
            $key = $this->key()->create('ServerDesk', $credential->public_key);
            $credential->server_provider_key_id = $key->id;
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
     * Creates a droplet
     *
     * @param string $plan
     * @param string $region
     * @param string $osId
     * @param string $scriptId
     * @param array $sshKeyId
     * @param string $label
     * @return void
     */
    public function createServer($plan, $region, $osId, $scriptId, $sshKeyId, $label)
    {
        return $this->droplet()->create(
            $label, // The label for the server
            $region,
            $plan, // The users selected DO plan
            $osId, // Image name
            false, // Enable backups
            false, // Enable IPV6
            false, // Option for private netowrking
            $sshKeyId,
            $scriptId
        );
    }

    /**
     * Deletes a server
     *
     * @param int $serverId
     * @return void
     */
    public function deleteServer($serverId)
    {
        try {
            $this->droplet()->delete($serverId);
        } catch (\Exception $e) {
            \Log::info($e);
        }
    }
}