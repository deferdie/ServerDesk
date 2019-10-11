<?php

namespace App\Http\Controllers\Api;

use App\Application;
use App\Jobs\DeployLaravel;
use App\Jobs\DeployStaticHTML;
use App\Events\DeployingApplication;
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
        $application->status = 'deploying';
        $application->save();

        broadcast(new DeployingApplication($application->fresh()));

        if ($application->type === 'Laravel') {
            DeployLaravel::dispatch($application);
        }
        
        if ($application->type === 'Static HTML') {
            DeployStaticHTML::dispatch($application);
        }
    }
}
