import { Controller, Post, Body, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import * as multer from 'multer';
import { ImportService } from './import.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('import')
export class ImportController {
    constructor(private readonly importService: ImportService) {}

    /**
     * Maneja la importación de un archivo CSV.
     * Valida la existencia del archivo y procesa su contenido.
     */
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async importCSV(@UploadedFile() file: Express.Multer.File) {
        try {
            // Validación: Verifica si se ha subido un archivo
            if (!file) {
                throw new HttpException('No se ha subido ningún archivo', HttpStatus.BAD_REQUEST);
            }

            // Validación: Verifica el tipo de archivo
            const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel'];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new HttpException('Tipo de archivo no permitido. Solo se aceptan archivos CSV.', HttpStatus.BAD_REQUEST);
            }

            // Validación: Verifica el tamaño del archivo (por ejemplo, máximo 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new HttpException('El archivo es demasiado grande. El tamaño máximo permitido es de 5MB.', HttpStatus.BAD_REQUEST);
            }

            // Lee el contenido del archivo CSV
            const rawData = await this.importService.readCSV(file.buffer);
            // Enriquecer los datos leídos
            const enrichedData = await this.importService.enrichData(rawData);
            // Guardar los datos enriquecidos en la base de datos
            await this.importService.saveToDatabase(enrichedData);

            return { message: 'Importación y enriquecimiento completados', data: rawData.length };   
        } catch (error) {
            console.log(error);
            // Manejo de errores: Lanza una excepción con un mensaje genérico
            throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}