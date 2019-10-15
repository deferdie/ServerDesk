<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\CronJob;
use App\Jobs\DeleteCronJob;
use App\Jobs\InstallCronJob;
use App\Http\Controllers\Controller;
use App\Http\Resources\CronJobResource;
use App\Http\Requests\CronJobStoreRequest;

class CronJobController extends Controller
{
    /**
     * Store a cron job
     *
     * @param Server $server
     * @param CronJobStoreRequest $request
     * @return void
     */
    public function store(Server $server, CronJobStoreRequest $request)
    {
        $job = CronJob::create([
            'name' => $request->name,
            'user' => $request->user,
            'cron' => $request->cron,
            'server_id' => $server->id,
            'command' => $request->command,
            'recurrence' => $request->recurrence,
        ]);

        InstallCronJob::dispatch($server, $job);

        return new CronJobResource($job);
    }

    /**
     * Deletes a cronjob
     *
     * @return void
     */
    public function destroy(Server $server, CronJob $job)
    {
        DeleteCronJob::dispatch($server, $job);
    }
}
