#!/bin/bash

## Go the the application diretory
cd /var/www/html/serverdesk

mkdir {{$application->domain}}

cd {{$application->domain}}

wget https://wordpress.org/latest.tar.gz

tar -xzvf latest.tar.gz
rm latest.tar.gz

cp -r wordpress/* ./

rm -rf wordpress

sudo chown -R www-data:www-data /var/www/html/serverdesk/{{$application->domain}}
sudo find /var/www/html/serverdesk/{{$application->domain}} -type f -exec chmod 644 {} \;
sudo find /var/www/html/serverdesk/{{$application->domain}} -type d -exec chmod 755 {} \;