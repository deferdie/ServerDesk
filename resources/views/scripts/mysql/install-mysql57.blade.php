sudo apt install mysql-server -y
sudo service mysql start
sudo systemctl start mysql

## Secure MYSQL
sudo mysql --execute="SELECT user,authentication_string,plugin,host FROM mysql.user;"

## Reset the root password
sudo mysql --execute="ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';"
sudo mysql --execute="FLUSH PRIVILEGES;" --password='{{$dbRootPass}}'
