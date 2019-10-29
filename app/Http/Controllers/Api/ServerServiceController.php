<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\Service;
use App\ServerService;
use App\Jobs\InstallPHP;
use App\Jobs\InstallNodeJS;
use App\Http\Controllers\Controller;
use App\Filters\ServerServiceFilter;
use App\Http\Requests\ServerServiceStoreRequest;
use App\Http\Resources\ServerServiceResource;

class ServerServiceController extends Controller
{
    /**
     * Gets all of the installed services on the server
     *
     * @return void
     */
    public function index(Server $server, ServerServiceFilter $filter)
    {
        $services = ServerService::where('server_id', $server->id)
            ->filterResult($filter)->get();

        return ServerServiceResource::collection($services);
    }

    /**
     * Installs a service on a server
     *
     * @param Server $server
     * @param Service $service
     * @return void
     */
    public function store(ServerServiceStoreRequest $request, Server $server, Service $service)
    {
        \Log::info($request->all());
        // $serverService = ServerService::create([
        //     'server_id' => $server->id,
        //     'service_id' => $service->id,
        //     'status' => 'installing'
        // ]);

        // if ($service->name == 'NodeJS') {
        //     InstallNodeJS::dispatch($server, $serverService);
        // }
        
        // if ($service->name == 'PHP-FPM') {
        //     $server->wants_php = true;
        //     $server->php_version = $request->php_version;
        //     $server->save();
        //     InstallPHP::dispatch($server, $serverService);
        // }

        // return new ServerServiceResource($serverService);
    }
}
