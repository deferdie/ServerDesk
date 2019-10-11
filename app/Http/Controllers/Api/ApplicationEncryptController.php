<?php

namespace App\Http\Controllers\Api;

use App\Application;
use App\Jobs\InstallSSLCert;
use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationEncryptionRequest;
use App\Http\Resources\ApplicationResource;
use App\Jobs\RemoveSSLCertSSL;

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
        $application->ssl_provider_id = $request->ssl_provider_id;
        $application->save();

        $application = $application->fresh();

        if ($application->sslProvider->name === 'lets_encrypt') {
            InstallSSLCert::dispatch($application);
        }

        return new ApplicationResource($application);
    }
    
    /**
     * Deletes an ssl cert from an application
     *
     * @param Application $application
     * @return void
     */
    public function decrypt(Application $application)
    {
        $application = $application->fresh();

        if ($application->sslProvider->name === 'lets_encrypt') {
            RemoveSSLCertSSL::dispatch($application);
        }

        $application->ssl_provider_id = null;
        $application->save();

        return new ApplicationResource($application);
    }
}
