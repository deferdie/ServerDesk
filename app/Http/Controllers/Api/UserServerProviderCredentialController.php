<?php

namespace App\Http\Controllers\Api;

use App\ServerProvider;
use App\UserServerProviderCredential;
use App\Http\Controllers\Controller;
use App\ServerProviders\DigitalOcean\DigitalOcean;
use App\Http\Resources\UserServerProviderCredentialResource;
use App\Http\Resources\UserServerProviderCredentialStoreRequest;

class UserServerProviderCredentialController extends Controller
{
    /**
     * Show all of the user providers
     *
     * @return void
     */
    public function index()
    {
        return UserServerProviderCredentialResource::collection(
            UserServerProviderCredential::where('user_id', auth()->user()->id)->get()
        );
    }

    /**
     * Create a credential for a user
     *
     * @return void
     */
    public function store(UserServerProviderCredentialStoreRequest $request, ServerProvider $provider)
    {
        $rsa = new RSA();
        $rsa->setPrivateKeyFormat(RSA::PUBLIC_FORMAT_OPENSSH);
        $rsa->setPublicKeyFormat(RSA::PUBLIC_FORMAT_OPENSSH);
        $keys = $rsa->createKey();

        $rsa->loadKey($keys['privatekey']);

        $credential = UserServerProviderCredential::create($request->all() + [
            'user_id' => auth()->user()->id,
            'public_key' => $keys['publickey'],
            'private_key' => $keys['privatekey'],
            'fingerprint' => $rsa->getPublicKeyFingerprint(),
        ]);

        if ($credential->provider->name === 'Digital Ocean') {
            $do = new DigitalOcean($credential);
            $do->key()->create('serverConfig', $keys['publickey']);
        }
    }
}
