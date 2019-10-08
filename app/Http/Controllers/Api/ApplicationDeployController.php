<?php

namespace App\Http\Controllers\Api;

use App\Application;
use App\Jobs\DeployLaravel;
use App\Http\Controllers\Controller;

class ApplicationDeployController extends Controller
{
    /**
     * Deploies an application
     *
     * @param Application $application
     * @return void
     */
    public function deploy(Application $application)
    {
        if ($application->type === 'Laravel') {
            DeployLaravel::dispatch($application);
        }
    }
}
