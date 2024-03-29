<?php

namespace App\Http\Controllers\Api;

use App\ServerProvider;
use phpseclib\Crypt\RSA;
use App\ServerProviders\Vultr\Vultr;
use App\Http\Controllers\Controller;
use App\UserServerProviderCredential;
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
            $credential = (new DigitalOcean($credential))->attachPublicKey($credential);
        }
        
        if ($credential->serverProvider->name === 'Vultr') {
            $credential = (new Vultr($credential))->attachPublicKey($credential);
        }
        
        return new UserServerProviderCredentialResource($credential);
    }

    /**
     * Delete a user server credential
     *
     * @param UserServerProviderCredential $credential
     * @return void
     */
    public function destroy(UserServerProviderCredential $credential)
    {
        if ($credential->serverProvider->name === 'Digital Ocean') {
            try {
                $do = new DigitalOcean($credential);
                $do->key()->delete($credential->server_provider_key_id);
                $credential->delete();
            } catch (\Exception $e) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'key' => ['The key could not be deleted']
                ]);
            }
        }
        
        if ($credential->serverProvider->name === 'Vultr') {
            try {
                (new Vultr($credential))->deletePublicKey($credential);

                $credential->delete();
            } catch (\Exception $e) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'key' => ['The key could not be deleted']
                ]);
            }
        }
    }
}
