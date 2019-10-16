<?php

namespace App\ServerProviders\DigitalOcean;

use App\UserServerProviderCredential;
use DigitalOceanV2\DigitalOceanV2;
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
}