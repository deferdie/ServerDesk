<?php

namespace App\Http\Controllers;

use App\Server;
use Illuminate\Http\Request;
use App\Http\Resources\ServerServiceResource;
use App\Jobs\InstallNodeJS;

class ServerServiceController extends Controller
{
    /**
     * Gets all of the installed services on the server
     *
     * @return void
     */
    public function index(Server $server)
    {
        $services = $server->services;

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
