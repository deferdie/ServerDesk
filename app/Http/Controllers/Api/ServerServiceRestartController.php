<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\ServerService;
use App\Jobs\RestartNginx;
use App\Http\Controllers\Controller;
use App\Http\Requests\ServerServiceRestartRequest;
use App\Http\Resources\ServerResource;

class ServerServiceRestartController extends Controller
{
    /**
     * Restart services on the server
     *
     * @param Server $server
     * @param ServerServiceRestartRequest $request
     * @return void
     */
    public function restart(Server $server, ServerServiceRestartRequest $request)
    {
        $serverService = ServerService::where('id', $request->server_service_id)->first();

        $serverService->status = 'restarting';
        $serverService->save();

        if ($serverService->service->name === 'Nginx') {
            RestartNginx::dispatch($server, $serverService);
        }

        return new ServerResource($server->fresh());
    }
}
