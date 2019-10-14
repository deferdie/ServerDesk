#!/bin/bash

sudo add-apt-repository ppa:certbot/certbot
wget https://dl.eff.org/certbot-auto
sudo mv certbot-auto /usr/local/bin/certbot-auto
sudo chown root /usr/local/bin/certbot-auto
chmod 0755 /usr/local/bin/certbot-auto
/usr/local/bin/certbot-auto --help
sudo apt install python-certbot-nginx -y

echo -e "Y\n" | /usr/local/bin/certbot-auto --install-only
