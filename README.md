<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Dev

1. Clonar el proyecto
2. Copiar el ```env.template``` y renombrar a ```.env```
3. Ejecutar
```
yarn install
```
4. Levantar la imagen (Se requiere instalar [Docker](https://docs.docker.com/desktop/setup/install/windows-install/))
```
docker-compose up -d
```
5. Levantar el servidor
```
yarn start:dev
```
6. Visitar el sitio de [Apollo](localhost:3000/graphql) que nos ayudará a interactuar con GraphQL, por defecto, la URL será
```
localhost:3000/graphql
```