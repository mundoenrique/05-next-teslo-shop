# Next.js OpenJira

Para correr localmente, se necesita la base de datos

```
docker-compose up -d
```

- El -d, significa **detached**

- MongoDb URL Local:

```
mongodb://localhost:27018/teslodb
```

## Configurar las variables de entorno

Renombrar el archivo **.env.template** a **.env**

## llenar la base de datos con información de pruebas

Llamar a:

```
http://localhost:3000/api/seed
```
