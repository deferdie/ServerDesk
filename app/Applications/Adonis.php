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

        $portToRunOn = $application->server->getAvaliablePort();

        // Set the port for Adonis to run on
        $application->server->exec(
            "cd /var/www/html/serverdesk/" . $application->domain . " && sed -i 's/PORT=.*/PORT=" . $portToRunOn . "/g' .env"
        );

        // Create the Adonis server process
        $process = Process::create([
            'name' => 'NodeJS process for ' . $application->domain,
            'user' => 'root',
            'server_id' => $application->server_id,
            'command' => 'adonis serve',
            'directory' => '/var/www/html/serverdesk/' . $application->domain . '/',
            'process_count' => 1,
        ]);

        // Install the process to run the Adonis server
        InstallProcess::dispatchNow($application->server, $process);

        // Setup the Nginx config for this site
        $application->server->exec(
            view('scripts.deployments.setup-nginx', [
                'application' => $application,
                'portToRunOn' => $portToRunOn
            ])->render()
        );

        $application->deployment_script = view('scripts.apps.adonis.adonis-deploy-default', [
            'application' => $application
        ])->render();

        $application->save();

        // Restart Nginx
        $application->server->exec("sudo systemctl restart nginx");

        return $application->fresh();
    }
}
