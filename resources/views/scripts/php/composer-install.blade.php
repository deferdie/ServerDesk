curl -o /tmp/composer-setup.php https://getcomposer.org/installer && \
curl -o /tmp/composer-setup.sig https://composer.github.io/installer.sig && \
php -r "if (hash('SHA384', file_get_contents('/tmp/composer-setup.php')) !== trim(file_get_contents('/tmp/composer-setup.sig'))) { unlink('/tmp/composer-setup.php'); echo 'Invalid installer' . PHP_EOL; exit(1); }" && \
php /tmp/composer-setup.php --quiet && \
rm /tmp/composer-setup.php && \
mv composer.phar /usr/local/bin/composer