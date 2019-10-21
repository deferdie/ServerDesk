server {
    include /etc/nginx/serverdesk/{{$application->domain}}.head;
    
    listen 80;
    listen [::]:80;
    server_name {{$application->domain}};

    @if($application->type == 'Adonis JS')
        location / {
            proxy_pass http://localhost:3333;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    @else
        root /var/www/html/serverdesk/{{$application->domain}}/{{$application->directory}};

        include /etc/nginx/serverdesk/{{$application->domain}}.main;

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
    @endif    
}
