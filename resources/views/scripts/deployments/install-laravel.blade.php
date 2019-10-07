#!/bin/bash

## Go the the application diretory
cd ## Go the the application diretory
cd /var/www/html/serverdesk/{{$repositoryDirectory}}

if [[ `composer --help` ]]; then
    if [ -f composer.json -a -f composer.lock ]; then
        composer install
    fi
else
    {!! file_get_contents(resource_path("views/scripts/php/composer-install.blade.php")) !!}
    composer install
fi

## Copy the .env.example file
if [ -f .env.example ]; then
    cp .env.example .env
fi

## Setup Laravel
if [ -f artisan ]; then
    php artisan key:generate
fi

## Set the permissions
sudo chown -R www-data:www-data /var/www/html/serverdesk/{{$repositoryDirectory}}
sudo find /var/www/html/serverdesk/{{$repositoryDirectory}} -type f -exec chmod 644 {} \;
sudo find /var/www/html/serverdesk/{{$repositoryDirectory}} -type d -exec chmod 755 {} \;
sudo chgrp -R www-data storage bootstrap/cache
sudo chmod -R ug+rwx storage bootstrap/cache

## Check if the user has set any predefined .env variables when creating the application
@isset($request->env_variables)
    @if(! is_null($request->env_variables) && $request->env_variables != '')
        echo '{{$request->env_variables}}' > .env
    @endif
@endisset
