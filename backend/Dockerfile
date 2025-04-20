FROM php:8.4.6-fpm-alpine3.20

# Instala dependencias para PHP y compilación de Xdebug
RUN apk update && apk add --no-cache \
    libzip-dev unzip git vim bash nginx supervisor \
    $PHPIZE_DEPS linux-headers autoconf gcc g++ make

# Instala extensiones PHP
RUN docker-php-ext-install zip pdo pdo_mysql

# Instala y habilita Xdebug
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Copiar configuración de Xdebug
COPY ./docker/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Copia archivos del proyecto
COPY . /var/www/html
