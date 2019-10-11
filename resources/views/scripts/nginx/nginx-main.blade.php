@if($application->ssl_enabled && $application->sslProvider->name === 'lets_encrypt')
# SSL certificate
ssl_certificate  /etc/letsencrypt/live/{{$application->domain}}/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/{{$application->domain}}/privkey.pem;

include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
@endif