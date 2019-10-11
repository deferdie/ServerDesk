@if($application->ssl_enabled && $application->sslProvider->name === 'lets_encrypt')
# RSA certificate
ssl_certificate  /etc/letsencrypt/live/{{$application->domain}}/fullchain.pem; # managed by Certbot
ssl_certificate_key /etc/letsencrypt/live/{{$application->domain}}/privkey.pem; # managed by Certbot

#include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
@endif