<?php

namespace App\Http\Controllers\Api;

use App\Application;
use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationEnvironmentUpdateRequest;

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
            $result = $application->server->exec('cat /var/www/html/serverdesk/'.$application->domain.'/.env');

            return $result->output;
        }
    }
    
    /**
     * Updates the env file for an application
     *
     * @param Application $application
     * @return void
     */
    public function update(Application $application, ApplicationEnvironmentUpdateRequest $request)
    {
        if ($application->type === 'Laravel') {
            $result = $application->server->exec('echo "'.$request->env.'" > /var/www/html/serverdesk/'.$application->domain.'/.env');

            return $result->output;
        }
    }
}
