#!/bin/bash

## Create the ssh folder if one does not exist
mkdir -p ~/.ssh

## Copy the public key if one does not exist
touch ~/.ssh/server-desk
echo "{{$server->credential->private_key}}" >  ~/.ssh/server-desk
