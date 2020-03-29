# Elije la imagen de Ubuntu
FROM ubuntu:trusty

# Autor/a
MAINTAINER Gustavo Velasquez

# Instalar Node.js y algunas dependencias
RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get -y install python build-essential nodejs

# Pasa módulos de node (node_modules) para caché
ADD package.json /src/package.json

# Elige el directorio de trabajo
WORKDIR /src

#Instala dependencias
RUN npm install

# Copia del directorio donde está el código al directorio dentro del
# container donde se va a ejecutar.
COPY  ["./server", "/src"]

# Ejecuta la aplicación con el parámetro
CMD [ "node", "/src/server.js" ]