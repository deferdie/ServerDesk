<?php

namespace App\Http\Controllers\Api;

use App\Application;
use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationEncryptionRequest;

class ApplicationEncryptController extends Controller
{
    /**
     * Installs an ssl cert to an application
     *
     * @param Application $application
     * @return void
     */
    public function encrypt(Application $application, ApplicationEncryptionRequest $request)
    {
        $result = $application->server->exec(
            view('scripts.deployments.install-letsencrypt', [
                'application' => $application
            ])->render()
        );

        \Log::info($result->output);
    }
}
