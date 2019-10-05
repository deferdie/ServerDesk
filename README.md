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
```bash
cp .env.example .env
```

- Generate app key
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

- Pusher
-- Add your pusher API keys to the .env file

- Add GitHub secrets in .env
```bash
GITHUB_CLIENT_ID=
GITHUB_REDIRECT_URI=
GITHUB_CLIENT_SECRET=
```
