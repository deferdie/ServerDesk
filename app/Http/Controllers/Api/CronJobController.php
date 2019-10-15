<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\CronJob;
use App\Http\Controllers\Controller;
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
        \Log::info($request-all());
    }
}
