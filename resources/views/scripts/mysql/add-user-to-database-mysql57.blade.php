mysql --execute="GRANT ALL PRIVILEGES ON {{$database}}.* TO '{{$name}}'@'localhost';"
mysql --execute="FLUSH PRIVILEGES;"