# pr-www

> Portfolio Report Website

## Getting started

``` bash
# Disable conversion of line endings (in Windows)
git config --global core.autocrlf false

# Clone repository
$ git clone ...

# Install dependencies
$ npm install
```

## Configuration

- Update `api/config.ts`

## Database

``` bash
# Initialize/update database
$ npm run migrations

# Get status of migrations
$ node_modules\.bin\sequelize-cli db:migrate:status
```

## GeoIP lookups

- Place `IP2LOCATION-LITE-DB1.IPV6.BIN` (from https://lite.ip2location.com) in db folder

## Build Setup

``` bash
# serve with hot reload at localhost:3000
$ npm run dev

# run nuxt in production mode and restart on changes in /api
$ npm run build
$ npm run devapi

# build for production and launch server
$ npm run build
$ npm start
```

## Docker

``` bash
# Create config
$ vim pr-www/api/config.ts

# Build image
$ docker build -t <my-image-name> pr-www/

# Create shared folder
$ mkdir -p shared/www-db-prod

# Run container
$ docker run -d --name pr-www-prod \
  --volume "$(pwd)"/shared/www-db-prod:/app/db \
  -e BASE_URL=https://www.example.com/ \
  --publish 127.0.0.1:3001:3000 <my-image-name>
```
