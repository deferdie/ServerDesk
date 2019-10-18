<?php

namespace App\Applications;

use App\Application;

class Laravel implements ApplicationInterface
{
    /**
     * Deploys a Laravel application
     *
     * @param \App\Application $application
     * @return \App\Application
     */
    public static function deploy(Application $application, $request)
    {
        $application->server->exec(
            view('scripts.deployments.install-laravel', [
                'request' => $request,
                'application' => $application,
            ])->render()
        );

        $application->server->exec(
            view('scripts.deployments.setup-nginx', [
                'application' => $application,
            ])->render()
        );

        $application->server->exec("sudo systemctl restart nginx");

        $application->deployment_script = view('scripts.apps.laravel.laravel-deploy-default', [
            'application' => $application
        ])->render();
        

        $application->save();

        return $application->fresh();
    }
}