#!/bin/bash

## Create the Nginx config files
echo '{!! view("scripts.nginx.nginx-main", ["application" => $application])->render()!!}' > /etc/nginx/serverdesk/{{$application->domain}}.main
echo '{!! view("scripts.nginx.nginx-head", ["application" => $application])->render()!!}' > /etc/nginx/serverdesk/{{$application->domain}}.head

## Create the server block
touch /etc/nginx/sites-available/{{$application->domain}}

## Create the server block for the site
echo '{!!view("scripts.nginx.site-nginx", ["application" => $application])->render()!!}' > /etc/nginx/sites-available/{{$application->domain}}

## Enable the site
ln -s /etc/nginx/sites-available/{{$application->domain}} /etc/nginx/sites-enabled/

## Reload Nginx
sudo systemctl reload nginx
