#!/bin/bash

## Create the Nginx config files
echo '{!! view("scripts.nginx.nginx-before", ["application" => $application])->render()!!}' > /etc/nginx/serverdesk/{{$application->domain}}.before
echo '{!! view("scripts.nginx.nginx-head", ["application" => $application])->render()!!}' > /etc/nginx/serverdesk/{{$application->domain}}.head
echo '{!! view("scripts.nginx.nginx-main", ["application" => $application])->render()!!}' > /etc/nginx/serverdesk/{{$application->domain}}.main

## Create the server block
touch /etc/nginx/sites-available/{{$application->domain}}

## Create the server block for the site
echo '{!!view("scripts.nginx.site-nginx", [
    "application" => $application,
    "portToRunOn" => $portToRunOn ?? '80',
])->render()!!}' > /etc/nginx/sites-available/{{$application->domain}}

## Enable the site
ln -s /etc/nginx/sites-available/{{$application->domain}} /etc/nginx/sites-enabled/

## Reload Nginx
sudo systemctl reload nginx
