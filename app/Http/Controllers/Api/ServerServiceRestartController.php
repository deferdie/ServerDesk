<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\Http\Controllers\Controller;
use App\Http\Requests\ServerServiceRestartRequest;

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
        \Log::info($request->all());
    }
}
