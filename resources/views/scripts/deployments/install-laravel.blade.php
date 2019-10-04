#!/bin/bash

## Go the the application diretory
cd ~/serverdesk/{{$repositoryDirectory}}

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
