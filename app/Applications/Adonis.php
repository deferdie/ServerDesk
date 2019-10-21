<?php

namespace App\Applications;

use App\Application;
use App\Jobs\InstallProcess;
use App\Process;

class Adonis implements ApplicationInterface
{
    /**
     * Deploys a AdonisJS app
     *
     * @param \App\Application $application
     * @return \App\Application
     */
    public static function deploy(Application $application, $request)
    {
        $application->server->exec(
            view('scripts.deployments.install-adonis', [
                'request' => $request,
                'application' => $application,
            ])->render()
        );

        // Setup the Nginx config for this site
        $application->server->exec(
            view('scripts.deployments.setup-nginx', [
                'application' => $application,
            ])->render()
        );

        $application->deployment_script = view('scripts.apps.adonis.adonis-deploy-default', [
            'application' => $application
        ])->render();

        $application->server->exec("sudo systemctl restart nginx");

        $application->save();

        $process = Process::create([
            'name' => 'NodeJS process for ' . $application->domain,
            'user' => 'root',
            'server_id' => $application->server_id,
            'command' => 'node /var/www/html/serverdesk/' . $application->domain . '/server.js',
            'process_count' => 1,
        ]);

        InstallProcess::dispatch($application->server, $process);

        return $application->fresh();
    }
}
