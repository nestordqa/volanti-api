Para inicializar la app de manera totalmente normal: npm run start:dev

Para inicializar como prod: npm run start:prod

-Púedes levantar la app tambien con Docker, asi no tienes que realizar la instalacion de Postgresql en tu entorno local:
Levantar: npm run docker:up
Bajar app: npm run docker:down

nota referente a variables de entorno: DATABASE_HOST si levantas con docker, debe ser db, si levantas en local debe ser localhost.

El endpoint /import recibe el archivo a procesar, si se detecta que el mismo no es un archivo csv, va a devolver un error.

En caso exitoso, va a devolver un objeto como el siguiente:

{
    "message": "Importación y enriquecimiento completados",
    "dataAnalyzed": {
        "ok": 136,
        "notOk": 18
    }
}

Indicando en la propiedad ok, las filas del archivo que fueron analizadas exitosamente, y las que no, en la propiedad notOk.

### Resumen del Código

1. **Importaciones**: Se importan los módulos y clases necesarios de NestJS, incluyendo `Controller`, `Post`, `Body`, `HttpException`, `HttpStatus`, `UseInterceptors` y `UploadedFile`. También se importa el servicio `ImportService` y el interceptor `FileInterceptor`.

2. **Controlador de Importación**: Se define el controlador `ImportController` que maneja las solicitudes de importación de datos.

3. **Método `importCSV`**: Este método se encarga de procesar la importación de un archivo CSV. Realiza las siguientes validaciones y acciones:
   - Verifica si se ha subido un archivo. Si no, lanza una `HttpException` con un código de estado 400 (Bad Request).
   - Llama al método `readCSV` del servicio `ImportService` para leer los datos del archivo CSV.
   - Llama al método `enrichData` del servicio `ImportService` para enriquecer los datos leídos.
   - Llama al método `saveToDatabase` del servicio `ImportService` para guardar los datos enriquecidos en la base de datos.
   - Devuelve un objeto con un mensaje de éxito y la cantidad de datos importados.
   - Si ocurre un error, maneja las excepciones de manera adecuada. Si la excepción es una `HttpException`, la vuelve a lanzar. De lo contrario, lanza una nueva `HttpException` con un código de estado 500 (Internal Server Error).

### Comentarios

1. Se han agregado validaciones para verificar si se ha subido un archivo antes de proceder con la importación y el enriquecimiento de datos.
2. Se ha manejado adecuadamente la excepción `HttpException`, distinguiéndola de otros tipos de errores y lanzando la excepción correspondiente.
3. Los comentarios proporcionados describen de manera clara y concisa las responsabilidades del controlador y del método `importCSV`.
