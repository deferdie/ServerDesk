<?php

namespace App\Http\Controllers\Api;

use App\ServerProvider;
use phpseclib\Crypt\RSA;
use App\UserServerProviderCredential;
use App\Http\Controllers\Controller;
use App\ServerProviders\DigitalOcean\DigitalOcean;
use App\Http\Resources\UserServerProviderCredentialResource;
use App\Http\Requests\UserServerProviderCredentialStoreRequest;

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

        if (UserServerProviderCredential::where('user_id', auth()->user()->id)
            ->where('key', $request->key)->exists()
        ) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'key' => ['This key already exists for this account']
            ]);
        }

        $credential = UserServerProviderCredential::create($request->all() + [
            'user_id' => auth()->user()->id,
            'public_key' => $keys['publickey'],
            'private_key' => $keys['privatekey'],
            'fingerprint' => $rsa->getPublicKeyFingerprint(),
        ]);

        if ($credential->serverProvider->name === 'Digital Ocean') {
            $do = new DigitalOcean($credential);

            $key = $do->key()->create('serverConfig', $keys['publickey']);
            $credential->server_provider_key_id = $key->id;
            $credential->save();
            
            return new UserServerProviderCredentialResource($credential);       
        }
    }
}
