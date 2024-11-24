# Proyecto Nest.js con TypeScript y TypeORM

Este proyecto utiliza **Nest.js** con **TypeScript** y **TypeORM** para conectarse a una base de datos **PostgreSQL**. La base de datos se gestiona mediante **Docker Compose**.

## Requisitos

- Instalación de **Docker** en el dispositivo.
- **Node.js** y **npm** instalados para la ejecución de los comandos de desarrollo.

## Instalación

1. Clona el repositorio:

   \```
   git clone <URL del repositorio>
   \```

2. Navega al directorio del proyecto:

   \```
   cd nombre-del-proyecto
   \```

3. Instala todas las dependencias necesarias:

   \```
   npm install
   \```

## Variables de Entorno

- **No cambies las variables de entorno**. Ya existen configuraciones en el directorio `postgres` que facilitan las pruebas, incluyendo datos predefinidos para iniciar la base de datos con un conjunto estándar de configuraciones.

## Uso de Docker

- Este proyecto se conecta a la base de datos **PostgreSQL** usando **Docker Compose**. Para crear la base de datos, utiliza el siguiente comando:

  \```
  npm run start:dbs
  \```

  Esto iniciará el contenedor de Docker para **PostgreSQL** con la configuración especificada.

## Ejecutar la Aplicación

- Para iniciar el servidor de desarrollo, usa el siguiente comando:

  \```
  npm run start:dev
  \```

  Esto iniciará la aplicación en modo desarrollo, lista para ser utilizada.

## Información Adicional

- La base de datos **PostgreSQL** se configura y se ejecuta con **Docker Compose**, permitiendo una integración sencilla para pruebas y desarrollo.
- Ya se incluye un directorio postgres donde están los archivos de la instalación de la base de datos, por lo que es necesario usar las mismas credenciales incluidas en el .env; el proposito de estos es facilitar el uso de datos de prueba.