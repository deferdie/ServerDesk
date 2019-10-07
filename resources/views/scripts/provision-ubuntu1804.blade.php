#!/bin/bash

## Update
sudo apt update -y

## Install software
sudo apt install git nginx -y

## Enable Nginx
sudo systemctl enable nginx

@if ($server->wants_mysql)
    ## Install MySQL
    @if($server->mysql_version == '5.7')
        @include('scripts.mysql.install-mysql57')
    @endif
@endif

## Install PHP
@if ($server->wants_php)
    ## Remove previous versions of PHP
    sudo apt-get purge `dpkg -l | grep php| awk '{print $2}' |tr "\n" " "`

    @if($server->php_version == '7.2')
        ## PHP software
        sudo apt install php7.2 php7.2-fpm php7.2-mysql php-common php7.2-cli php7.2-common php7.2-json php7.2-opcache php7.2-readline php7.2-mbstring php7.2-xml php7.2-gd php7.2-curl zip unzip php7.2-zip -y

        ## Enable php
        sudo systemctl start php7.2-fpm
        sudo systemctl enable php7.2-fpm
    @endif

    ## Reset the default nginx server block
    sudo rm /etc/nginx/sites-enabled/default
    sudo touch /etc/nginx/conf.d/default.conf
    echo '{!! file_get_contents(resource_path("views/scripts/nginx/default.blade.php")) !!}' > /etc/nginx/conf.d/default.conf

    ## Create the default site
    sudo touch /usr/share/nginx/html/info.php
    echo '{!! file_get_contents(resource_path("views/scripts/php/default.blade.php")) !!}' > /usr/share/nginx/html/info.php

    ## Install composer
    @include('scripts.php.composer-install')
@endif

## Start Nginx
sudo nginx -t
sudo systemctl start nginx
sudo systemctl reload nginx
