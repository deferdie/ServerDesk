#!/bin/bash

## Create the ssh folder if one does not exist
mkdir -p ~/.ssh

## Create known hosts
touch ~/.ssh/known_hosts
ssh-keyscan github.com > ~/.ssh/known_hosts

## Copy the public key if one does not exist
touch ~/.ssh/.serverdesk
echo "{{$server->credential->private_key}}" >  ~/.ssh/.serverdesk
chmod 400 ~/.ssh/.serverdesk