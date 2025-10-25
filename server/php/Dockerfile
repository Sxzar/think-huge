FROM php:8.2-fpm-alpine

RUN apk add --no-cache unzip git zip \
  && docker-php-ext-install pdo pdo_mysql
  
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY php.ini /usr/local/etc/php/php.ini
