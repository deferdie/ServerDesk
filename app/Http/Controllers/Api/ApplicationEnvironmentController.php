<?php

namespace App\Http\Controllers\Api;

use App\Application;
use App\Http\Controllers\Controller;

class ApplicationEnvironmentController extends Controller
{
    /**
     * Returns the environment settings for the type of application
     *
     * @param Application $application
     * @return void
     */
    public function show(Application $application)
    {
        if ($application->type === 'Laravel') {
            $result = $application->server->exec('cat /var/www/html/'.$application->domain.'/.env');

            return $result->output;
        }
    }
}
