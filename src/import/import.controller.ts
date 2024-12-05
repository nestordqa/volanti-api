import { Controller, Post, Body, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import * as multer from 'multer';
import { ImportService } from './import.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async importCSV(@UploadedFile() file: Express.Multer.File) {
        try {
            if (!file) {
                throw new HttpException('No se ha subido ningún archivo', HttpStatus.BAD_REQUEST);
            }
            const rawData = await this.importService.readCSV(file.buffer); // Implementa la lectura del CSV
            const enrichedData = await this.importService.enrichData(rawData);
            await this.importService.saveToDatabase(enrichedData); // Implementa la lógica para guardar en la base de datos
            return { message: 'Importación y enriquecimiento completados', data: rawData.length };   
        } catch (error) {
            throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}