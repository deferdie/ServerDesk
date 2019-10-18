<?php

namespace App\Applications;

use App\Application;

class StaticHtml implements ApplicationInterface
{
    /**
     * Deploys a StaticHtml website
     *
     * @param \App\Application $application
     * @return \App\Application
     */
    public static function deploy(Application $application, $request)
    {
        $application->server->exec(
            view('scripts.deployments.install-static-html', [
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

        $application->deployment_script = view('scripts.apps.static-html.static-html-deploy-default', [
            'application' => $application
        ])->render();

        $application->server->exec("sudo systemctl restart nginx");

        $application->save();

        return $application->fresh();
    }
}
