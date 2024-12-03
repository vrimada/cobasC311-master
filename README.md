# cobasC311
Interface para equipo de laboratorio CobasC311

### Configuración
Abrir una consola en el directorio donde se copio el proyecto, y ejecutar la instrucción `node ./dist/Utils/list-ports.js`

El parámetro `path` que se imprimirá en la consola debe ser asignado a la variable `comPort` en el archivo `config.js`.


> Revisar que se haya conectado correctamente el equipo COBAS a la computadora donde esta instalada la interfaz. 

>Si hay más de un puerto listado, se debe configurar el especifica en su **pnpId** que es USB. Actualmente el cable de conexión usa un adaptador de puerto Serial a USB por dicha razon sale el nombre USB en el puerto de COBAS.


### Dependencias

+ [serialport](https://www.npmjs.com/package/serialport): Libreria que controla los recursos de puerto serie.
+ [seriate](https://www.npmjs.com/package/seriate): Libreria para conectarse a un servidor de base de datos.
+ [winston](https://www.npmjs.com/package/winston): Libreria para logs
 