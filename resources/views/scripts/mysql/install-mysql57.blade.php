sudo apt install mysql-server -y
sudo service mysql start
sudo systemctl start mysql

## Secure MYSQL
sudo mysql --execute="SELECT user,authentication_string,plugin,host FROM mysql.user;"

## Create a new user for serverdesk
sudo mysql --execute="CREATE USER 'serverdesk'@'localhost' IDENTIFIED BY 'password';"
sudo mysql --execute="GRANT ALL PRIVILEGES ON *.* TO 'serverdesk'@'localhost' WITH GRANT OPTION;"

## Create a new database for serverdesk
sudo mysql --execute="CREATE database serverdesk;"

## Reset the root password
sudo mysql --execute="ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';"
sudo mysql --execute="FLUSH PRIVILEGES;" --password='password'
