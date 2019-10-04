#!/bin/bash

## Go the the application diretory
cd ~/serverdesk

## Clone the application
ssh-agent bash -c 'ssh-add ~/.ssh/server-desk; git clone git@github.com:{{$application->respository}}.git'
