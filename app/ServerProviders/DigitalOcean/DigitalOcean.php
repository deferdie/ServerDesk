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
}