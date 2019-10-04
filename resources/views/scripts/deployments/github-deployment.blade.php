#!/bin/bash

## Go the the application diretory
cd /var/www/html/serverdesk

echo git@github.com:{{$application->respository}}.git

## Clone the application
ssh-agent bash -c 'ssh-add ~/.ssh/.serverdesk; git clone git@github.com:{{$application->respository}}.git {{$application->domain}}'
