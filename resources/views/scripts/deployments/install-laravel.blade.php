#!/bin/bash

if [[ `composer --help` ]]; then

else
    {!! file_get_contents(resource_path("views/scripts/php/composer-install.blade.php")) !!}
fi

@if($application->deployment_script)
    {!! $application->deployment_script !!}
@else
    @include('scripts.apps.laravel.laravel-deploy-default', [
        'application' => $application
    ])
@endif

## Check if the user has set any predefined .env variables when creating the application
@isset($request)
    @isset($request->env_variables)
        @if(! is_null($request->env_variables) && $request->env_variables != '')
            echo '{{$request->env_variables}}' > .env
        @endif
    @endisset
@endisset

## Set the permissions
sudo chown -R www-data:www-data /var/www/html/serverdesk/{{$application->domain}}
sudo find /var/www/html/serverdesk/{{$application->domain}} -type f -exec chmod 644 {} \;
sudo find /var/www/html/serverdesk/{{$application->domain}} -type d -exec chmod 755 {} \;
sudo chgrp -R www-data storage bootstrap/cache
sudo chmod -R ug+rwx storage bootstrap/cache
