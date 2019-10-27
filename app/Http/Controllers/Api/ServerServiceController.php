<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\ServerService;
use App\Jobs\InstallNodeJS;
use App\Http\Controllers\Controller;
use App\Filters\ServerServiceFilter;
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
    public function store(Server $server, Service $service)
    {
        if ($service->name == 'NodeJS') {
            InstallNodeJS::dispatch($server);
        }
    }
}
