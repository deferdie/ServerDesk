#!/bin/bash

cd ~/.ssh

if [ -f authorized_keys ]; then
    touch authorized_keys
fi

echo >> authorized_keys

echo {{decrypt($key->key)}} >> authorized_keys