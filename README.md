# 🌟 Volanti API Rest 🌟

¡Bienvenido a la documentación! Este proyecto está construido con **NestJS**, **PostgreSQL** y **Docker**, y está diseñado para ser fácil de usar y altamente eficiente. A continuación, encontrarás toda la información necesaria para comenzar a usarlo.

---

## 🚀 Instalación

1. Clona el repositorio en tu máquina local:

   ```bash
   git clone https://github.com/nestordqa/volanti-api.git
   cd volanti-api
   ```

2. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

## 🚀 Inicialización de la Aplicación

### Modo Desarrollo

Para iniciar la aplicación en modo desarrollo, simplemente ejecuta:

```bash
npm run start:dev
```

### Modo Producción

Si deseas ejecutar la aplicación en modo producción, utiliza el siguiente comando:

```bash
npm run start:prod
```

### Uso de Docker

¡No te preocupes por instalar PostgreSQL en tu entorno local! Puedes levantar la aplicación utilizando Docker. Aquí están los comandos que necesitas:

- **Levantar la aplicación**:

```bash
npm run docker:up
```

- **Bajar la aplicación**:

```bash
npm run docker:down
```

### 🌐 Variables de Entorno

Recuerda configurar la variable de entorno `DATABASE_HOST` de acuerdo a tu entorno:

- **Con Docker**: `DATABASE_HOST=db`
- **En local**: `DATABASE_HOST=localhost`

---

## 📁 Endpoint de Importación

La aplicación incluye un endpoint para importar archivos:

### `/import`

Este endpoint recibe un archivo para procesar. **Importante**: si el archivo no es un CSV, se devolverá un error.

#### 🎉 Respuesta Exitosa

Si la importación es exitosa, recibirás un objeto con la siguiente estructura:

```json
{
    "message": "Importación y enriquecimiento completados",
    "dataAnalyzed": {
        "ok": 136,
        "notOk": 18
    }
}
```

- **ok**: Número de filas del archivo que fueron analizadas exitosamente.
- **notOk**: Número de filas que no fueron procesadas correctamente.

---

## 📝 Resumen del Código

### Importaciones

Se importan los módulos y clases necesarios de NestJS, incluyendo:

- `Controller`
- `Post`
- `Body`
- `HttpException`
- `HttpStatus`
- `UseInterceptors`
- `UploadedFile`

Además, se importa el servicio `ImportService` y el interceptor `FileInterceptor`.

### Controlador de Importación

El controlador `ImportController` se encarga de manejar las solicitudes de importación de datos.

### Método `importCSV`

Este método es el corazón de la importación de archivos CSV y realiza las siguientes acciones:

1. **Verificación de Archivo**: Comprueba si se ha subido un archivo. Si no, lanza una `HttpException` con un código de estado 400 (Bad Request).
2. **Lectura de Datos**: Llama al método `readCSV` del servicio `ImportService` para leer los datos del archivo.
3. **Enriquecimiento de Datos**: Llama al método `enrichData` del servicio `ImportService` para enriquecer los datos leídos.
4. **Guardado en Base de Datos**: Llama al método `saveToDatabase` del servicio `ImportService` para almacenar los datos enriquecidos.
5. **Respuesta**: Devuelve un objeto con un mensaje de éxito y la cantidad de datos importados.
6. **Manejo de Errores**: Si ocurre un error, maneja las excepciones adecuadamente, lanzando `HttpException` según corresponda.

### 💡 Comentarios Adicionales

- Se han implementado validaciones para asegurar que se suba un archivo antes de proceder con la importación.
- Se maneja la excepción `HttpException` de manera diferenciada, asegurando una respuesta adecuada ante errores.

---

¡Espero que esta guía te sea útil! 🚀✨