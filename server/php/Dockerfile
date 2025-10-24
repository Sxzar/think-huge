FROM php:8.2-fpm-alpine

RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www
COPY php.ini /usr/local/etc/php/php.ini
