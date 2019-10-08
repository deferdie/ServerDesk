mysql --execute="REVOKE ALL PRIVILEGES ON {{$database}}.* FROM '{{$name}}'@'localhost';"
mysql --execute="FLUSH PRIVILEGES;"