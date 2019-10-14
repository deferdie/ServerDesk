<?php

namespace App\Http\Controllers\Api;


use App\Server;
use App\Process;
use App\Jobs\DeleteProcess;
use App\Jobs\RestartProcess;
use App\Jobs\InstallProcess;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProcessResource;
use App\Http\Requests\ProcessStoreRequest;

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
     * Restart a server process
     *
     * @return void
     */
    public function update(Server $server, Process $process)
    {
        $process->status = 'restarting';
        $process->save();

        RestartProcess::dispatch($server, $process);

        return new ProcessResource($process->fresh());
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
