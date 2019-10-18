#!/bin/bash

## Go the the application diretory
cd /var/www/html/serverdesk

## Clone the application
git clone https://x-token-auth:{{$access_token}}@bitbucket.org/{{$application->respository}}.git {{$application->domain}}
