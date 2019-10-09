<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\PublicKey;
use App\Jobs\RemovePublicKey;
use App\Jobs\InstallPublicKey;
use App\Http\Controllers\Controller;
use App\Http\Requests\PublicKeyStoreRequest;
use App\Http\Resources\PublicKeyResource;

class PublicKeyController extends Controller
{
    /**
     * Return all of the public keys for a server
     *
     * @return void
     */
    public function index(Server $server)
    {
        return PublicKeyResource::collection($server->publicKeys);
    }

    /**
     * Create a new public key for a server
     *
     * @param Server $server
     * @param PublicKeyStoreRequest $request
     * @return void
     */
    public function store(Server $server, PublicKeyStoreRequest $request)
    {
        $key = PublicKey::create([
            'name' => $request->name,
            'server_id' => $server->id,
            'key' => encrypt($request->key),
        ]);

        InstallPublicKey::dispatch($key);

        return new PublicKeyResource($key);
    }

    /**
     * Deletes a public key from the server
     *
     * @param Server $server
     * @param PublicKey $key
     * @return void
     */
    public function destroy(Server $server, PublicKey $key)
    {
        $key = PublicKey::where('server_id', $server->id)->whereId($key->id)->firstOrFail();

        RemovePublicKey::dispatch($key);
    }
}
