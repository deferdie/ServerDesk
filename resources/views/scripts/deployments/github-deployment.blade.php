#!/bin/bash

## Go the the application diretory
cd ~/serverdesk

echo git@github.com:{{$application->respository}}.git

## Clone the application
ssh-agent bash -c 'ssh-add /root/.ssh/.serverdesk; git clone git@github.com:{{$application->respository}}.git'
