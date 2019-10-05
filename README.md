# Server Desk

## Installation

- Clone the repo
- Installing all Composer & NPM dependencies.

```bash
docker-compose up -d
```
- SSH into the container 
```bash
docker exec -it serverdesk-php sh
```

```bash
composer install && npm install
```

- Copy .env.example to .env
- Generate app key

- Pusher
-- Add your pusher API keys to the .env file

```bash
php artisan key:generate
```

- Run database migration

```bash
php artisan migrate:fresh
```

- Generate JWT secret

```bash
php artisan jwt:secret
```

- Compiling Assets

```bash
npm run dev
```
