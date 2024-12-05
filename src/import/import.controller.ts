import { Controller, Post, Body } from '@nestjs/common';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
    constructor(private readonly importService: ImportService) {}

    @Post()
    async importData(@Body('filePath') filePath: string) {
        await this.importService.importCSV(filePath);
        return { message: 'Importación completada' };
    }
}