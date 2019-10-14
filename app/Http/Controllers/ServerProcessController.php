<?php

namespace App\Http\Controllers;


use App\Http\Requests\ProcessStoreRequest;
use App\Http\Resources\ProcessResource;
use App\Jobs\DeleteProcess;
use App\Jobs\InstallProcess;
use App\Process;
use App\Server;

class ServerProcessController extends Controller
{
    /**
     * Returns all of the processes for the server
     *
     * @return void
     */
    public function index(Server $server)
    {
        return ProcessResource::collection($server->processes);
    }
    
    /**
     * Returns a single server process
     *
     * @return void
     */
    public function show(Server $server, Process $process)
    {
        return new ProcessResource($process);
    }
    
    /**
     * Creates a process
     *
     * @return void
     */
    public function store(Server $server, ProcessStoreRequest $request)
    {
        $process = Process::create([
            'name' => $request->name,
            'user' => $request->user,
            'server_id' => $server->id,
            'command' => $request->command,
            'process_count' => $request->process_count,
        ]);

        InstallProcess::dispatch($server, $process);

        return new ProcessResource($process);
    }
    
    /**
     * Deletes a process
     *
     * @return void
     */
    public function destroy(Server $server, Process $process)
    {
        DeleteProcess::dispatch($server, $process);

        return new ProcessResource($process);
    }
}
