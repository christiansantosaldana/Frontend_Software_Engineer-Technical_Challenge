# Estructura de archivos

El proyecto se divide en frontend y backend cada uno con su propio package.json para instalar sus respectivas dependencias y asi poder inicializarlos.

## Instalación de dependencias:

Requiere tener instalado nodeJS, se puede descargar desde https://nodejs.org/es/download/
Por consola ingresar a la carpeta backend y ejecutar el comando "npm i"
Por consola ingresar a la carpeta frontend y ejecutar el comando "npm i"
Instalar MongoDB 4.4.2 con opciones por defecto, se puede descargar desde https://www.mongodb.com/try/download/community
Configurar variable de entorno para MongoDB.
-Presionar tecla windows y digitar "variables de entorno", escoger la opción "Editar las variables de entorno en el sistema"
-Click en el botón "variables de entorno"
-En la parte de "variables de sistema" buscar y seleccionar la opción "Path" y click en "Editar" que se encuentra debajo de dichas opciones
-En la ventana dar click en el botón "Nuevo"
-En el espacio en blanco ingresar "C:\Program Files\MongoDB\Server\4.2\bin"
-Click en botón aceptar y nuevamente en aceptar.

## Inicializar en modo producción local:

Por consola ingresar a la carpeta backend y ejecutar el comando npm start, con esto se podra ingresar al navegador e ir a la direccion "localhost:4000" para ingresar al sistema.

## Inicializar en modo desarrollo local:

Por consola ingresar a la carpeta backend y ejecuar el comando "npm run dev"
Por consola ingresar a la carpeta frontend y ejecutar el comando "npm run dev"
Al culminar los cambios del frontend se debe ingresar a la carpeta frontend por consola y ejecutar el comando "npm start" para que los cambios sean visibles en producción.

### Inicializar test automatizado (requiere inicializar modo desasrrollo)

Por consola ingresar a la carpeta frontend y ejecutar el comando "npx cypress open"
Se abrira una nueva ventana donde se puede seleccionar los test que se desea ejecutar. (Solo escoger los que terminen en spec.js)
Los registros utilizados por los test no afectan a los registros ingresados mediante el sistema

*Para tener datos de prueba inicializar el spec fillBD.spec.js