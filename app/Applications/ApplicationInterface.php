<?php

namespace App\Applications;

use App\Application;

interface ApplicationInterface
{
    /**
     * Deploys an application
     *
     * @param Application $application
     * @param mixed $request
     * @return void
     */
    public static function deploy(Application $application, $request);
}