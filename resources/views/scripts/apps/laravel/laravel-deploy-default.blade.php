cd /var/www/html/serverdesk/{{$application->domain}}
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "" | sudo -S service php7.2-fpm reload

## Copy the .env.example file
if [ -f .env.example ]; then
    cp .env.example .env
fi

## Setup Laravel
if [ -f artisan ]; then
    php artisan key:generate
fi