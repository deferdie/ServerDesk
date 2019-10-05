server {
    listen 80;
    listen [::]:80;
    server_name {{$application->domain}};
    root /var/www/html/serverdesk/{{$application->domain}}/{{$application->directory}};

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.html index.htm index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/{{$application->domain}}-error.log error;

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php7.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        include snippets/fastcgi-php.conf;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}