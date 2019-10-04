<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\ServerProvider;
use App\Jobs\CreateServer;
use App\Http\Controllers\Controller;
use App\UserServerProviderCredential;
use App\Http\Resources\ServerResource;
use App\Http\Requests\ServerStoreRequest;
use App\ServerProviders\DigitalOcean\DigitalOcean;

class ServerController extends Controller
{
    /**
     * Show all of the users servers
     *
     * @return void
     */
    public function index()
    {
        return ServerResource::collection(Server::where('user_id', auth()->user()->id)->get());
    }

    /**
     * Create a server
     *
     * @param ServerStoreRequest $request
     * @return void
     */
    public function store(ServerStoreRequest $request)
    {
        $provider = ServerProvider::whereId($request->server_provider_id)->first();

        if ($provider->name == 'Digital Ocean') {
            $plan = null;
            $do = new DigitalOcean(UserServerProviderCredential::whereId($request->user_server_provider_credential_id)->first());

            foreach ($do->size()->getAll() as $planToCheck) {
                if ($planToCheck->slug === $request->plan) {
                    $plan = $planToCheck;
                    break;
                }
            }

            $server = Server::create([
                'disk' => $plan->disk,
                'status' => 'creating',
                'cpus' => $plan->vcpus,
                'region' => $plan->vcpus,
                'name' => $request->name,
                'memory' => $plan->memory,
                'user_id' => auth()->user()->id,
                'wants_php' => $request->wants_php,
                'server_provider_id' => $provider->id,
                'php_version' => $request->php_version,
                'provider_server_region' => $request->provider_server_region,
                'provider_credential_id' => $request->provider_credential_id,
                'user_server_provider_credential_id' => $request->user_server_provider_credential_id,
            ]);

            CreateServer::dispatch($server, $plan, $provider);

            return new ServerResource($server->fresh());
        }
    }
}
