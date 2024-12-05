import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios from 'axios';
import * as fs from 'fs';
import * as csv from 'csv-parser'; // Asegúrate de tener esta librería instalada
import { Readable } from 'stream';

dotenv.config(); // Carga las variables de entorno

@Injectable()
export class ImportService {
    async enrichData(data: any[]): Promise<any[]> {
        const enrichedData = await Promise.all(data.map(async (item) => {
            const enrichedItem = await this.callOpenAI(item);
            return { ...item, ...enrichedItem };
        }));
        return enrichedData;
    }

    private async callOpenAI(item: any): Promise<any> {
        const prompt = this.createPrompt(item);
        
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo', // O el modelo que desees usar
                messages: [{
                    role: 'user', 
                    content: prompt 
                }],
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data.choices[0].message.content; // Ajusta según la respuesta esperada
        } catch (error) {
            console.error('Error al llamar a OpenAI:', error);
            return {}; // Manejo de errores
        }
    }

    private createPrompt(item: any): string {
        // Crea un prompt basado en el item que deseas enriquecer
        return `Enriquece la siguiente información: ${JSON.stringify(item)}`;
    }

    public async saveToDatabase(data: any[]): Promise<void> {
        console.log(data, 'PARA GUARDAR EN DB');
        // Implementa la lógica para guardar los datos enriquecidos en la base de datos
    }

    public async readCSV(fileBuffer: Buffer): Promise<any[]> {
        return new Promise((resolve, reject) => {
          const results: any[] = [];
          const readableStream = new Readable();
          readableStream.push(fileBuffer);
          readableStream.push(null); // Indica el final del flujo
    
          readableStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results); // Resuelve la promesa con los datos leídos
            })
            .on('error', (error) => {
                console.error('Error al leer el archivo CSV:', error);
                reject(error); // Rechaza la promesa en caso de error
            });
        });
    }
}