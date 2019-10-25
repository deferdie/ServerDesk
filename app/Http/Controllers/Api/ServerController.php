<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\ServerProvider;
use App\Jobs\DeployServer;
use App\Http\Controllers\Controller;
use App\ServerProviders\Vultr\Vultr;
use App\UserServerProviderCredential;
use App\Http\Resources\ServerResource;
use App\Http\Requests\ServerStoreRequest;
use App\ServerProviders\DigitalOcean\DigitalOcean;
use App\ServerService;
use App\Service;

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
     * Show a server
     *
     * @return void
     */
    public function show(Server $server)
    {
        return new ServerResource($server);
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
                'wants_node' => $request->wants_node,
                'server_provider_id' => $provider->id,
                'wants_mysql' => $request->wants_mysql,
                'php_version' => $request->php_version,
                'mysql_version' => $request->mysql_version,
                'provider_server_region' => $request->provider_server_region,
                'provider_credential_id' => $request->provider_credential_id,
                'user_server_provider_credential_id' => $request->user_server_provider_credential_id,
            ]);

            DeployServer::dispatch($server, $plan, $provider);

            return new ServerResource($server->fresh());
        }
        
        if ($provider->name == 'Vultr') {
            $vultr = new Vultr(UserServerProviderCredential::whereId($request->user_server_provider_credential_id)->first());

            $plan = $vultr->getPlan($request->plan);

            $server = Server::create([
                'disk' => $plan->disk,
                'status' => 'creating',
                'cpus' => $plan->vcpu_count,
                'name' => $request->name,
                'memory' => $plan->ram,
                'user_id' => auth()->user()->id,
                'wants_php' => $request->wants_php,
                'wants_node' => $request->wants_node,
                'server_provider_id' => $provider->id,
                'wants_mysql' => $request->wants_mysql,
                'php_version' => $request->php_version,
                'mysql_version' => $request->mysql_version,
                'provider_server_region' => $request->provider_server_region,
                'provider_credential_id' => $request->provider_credential_id,
                'user_server_provider_credential_id' => $request->user_server_provider_credential_id,
            ]);

            // Attach the services to this server
            if ($request->wants_php) {
                $service = Service::whereName('PHP-FPM')->first();
                ServerService::create([
                    'service_id' => $service->id,
                    'server_id' => $server->id,
                    'status' => 'running',
                ]);
            }
            
            if ($request->wants_node) {
                $service = Service::whereName('NodeJS')->first();
                ServerService::create([
                    'service_id' => $service->id,
                    'server_id' => $server->id,
                    'status' => 'running',
                ]);
            }
            
            if ($request->wants_mysql) {
                $service = Service::whereName('MySQL')->first();
                ServerService::create([
                    'service_id' => $service->id,
                    'server_id' => $server->id,
                    'status' => 'running',
                ]);
            }
            
            $service = Service::whereName('Nginx')->first();
            ServerService::create([
                'service_id' => $service->id,
                'server_id' => $server->id,
                'status' => 'running',
            ]);
            

            DeployServer::dispatch($server, $plan, $provider);

            return new ServerResource($server->fresh());
        }
    }

    /**
     * Delete a server
     *
     * @return void
     */
    public function destroy(Server $server)
    {
        if ($server->serverProvider->name === 'Digital Ocean') {
            (new DigitalOcean($server->credential))->deleteServer($server->provider_server_id);
        }
        
        if ($server->serverProvider->name === 'Vultr') {
            (new Vultr($server->credential))->deleteServer($server->provider_server_id);
        }

        // Delete all of the applications of the server
        foreach ($server->applications as $app) {
            $app->delete();
        }
        
        // Delete all of the keys
        foreach ($server->publicKeys as $key) {
            $key->delete();
        }

        // Delete all of the users
        foreach ($server->mySQLUsers as $user) {
            $user->delete();
        }
        
        // Delete all of the databases
        foreach ($server->mySQLDatabase as $db) {
            $db->delete();
        }
        
        // Delete all of the processes
        foreach ($server->processes as $process) {
            $process->delete();
        }
        
        // Delete all of the cronjobs
        foreach ($server->cronjobs as $job) {
            $job->delete();
        }
        
        // Delete all of the services
        foreach ($server->services as $service) {
            $service->delete();
        }

        $server->delete();
    }
}
