#!/bin/bash

## Go the the application diretory
cd /var/www/html/serverdesk

## Clone the application
git clone git@github.com:{{$application->respository}}.git {{$application->domain}}