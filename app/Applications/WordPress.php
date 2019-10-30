<?php

namespace App\Applications;

use App\Application;

class WordPress implements ApplicationInterface
{
    /**
     * Deploys a WordPress application
     *
     * @param \App\Application $application
     * @return \App\Application
     */
    public static function deploy(Application $application, $request)
    {
        try {
            $application->server->exec(
                view('scripts.deployments.install-wordpress', [
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

            $application->deployment_script = view('scripts.apps.wordpress.wordpress-deploy-default', [
                'application' => $application
            ])->render();

            $application->save();

            return $application->fresh();
        } catch (\Exception $e) {
            \Log::info($e);
        }
    }
}