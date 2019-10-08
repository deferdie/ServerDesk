mysql --execute="CREATE USER '{{$name}}'@'localhost';"

@if($password != null && $password != '')
mysql --execute="ALTER USER '{{$name}}'@'localhost' IDENTIFIED BY '{{$password}}';"
@endif

mysql --execute="FLUSH PRIVILEGES;"