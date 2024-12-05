import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class ImportService {

    async importCSV(filePath: string) {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                // Aquí puedes limpiar y enriquecer los datos
                console.log(results);
            });
    }
}