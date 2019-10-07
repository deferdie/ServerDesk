sudo apt install mysql-server -y
sudo service mysql start
sudo systemctl start mysql

## Secure MYSQL
sudo mysql --execute="SELECT user,authentication_string,plugin,host FROM mysql.user;"

## Create a defaule user
sudo mysql --execute="CREATE USER 'serverdesk'@'localhost' IDENTIFIED BY '{{$dbRootPass}}';"
sudo mysql --execute="GRANT ALL ON *.* TO 'serverdesk'@'localhost'; FLUSH PRIVILEGES;"
