FROM mysql:8.0.18

MAINTAINER Gustavo Velasquez

ENV MYSQL_DATABASE=componentes \
    MYSQL_ROOT_PASSWORD=pass

ADD dump_base_de_datos.sql /docker-entrypoint-initdb.d

EXPOSE 3306