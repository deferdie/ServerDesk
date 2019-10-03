<?php

namespace App\Http\Controllers\Api;

use App\Events\ServerUpdated;
use App\Server;
use App\Http\Controllers\Controller;
use App\Http\Resources\ServerResource;

class ServerController extends Controller
{
    /**
     * Show all of the users servers
     *
     * @return void
     */
    public function index()
    {
        broadcast(new ServerUpdated(Server::find(1)));
        return ServerResource::collection(Server::all());
    }

    /**
     * Create a server
     *
     * @param ServerStoreRequest $request
     * @return void
     */
    public function store(ServerStoreRequest $request)
    {
        $provider = Provider::whereId($request->provider_id)->first();

        if ($provider->name == 'Digital Ocean') {
            $plan = null;

            foreach (DigitalOcean::size()->getAll() as $planToCheck) {
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
                'provider_id' => $provider->id,
                'user_id' => auth()->user()->id,
                'wants_php' => $request->wants_php,
                'php_version' => $request->php_version,
                'provider_credential_id' => $request->provider_credential_id,
            ]);

            CreateServer::dispatch($server, $plan, $provider, $request->region);

            return $server;
        }
    }
}
