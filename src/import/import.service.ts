import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios from 'axios';
import * as fs from 'fs';
import * as csv from 'csv-parser'; // Asegúrate de tener esta librería instalada
import { Readable } from 'stream';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from 'src/vehicle/vehicle.entity';
import { Customer } from 'src/costumer/costumer.entity';
import { Appointment } from 'src/appointment/appointment.entity';
import { Repository } from 'typeorm';
import { Phone } from 'src/phone/phone.entity';
import { AppointmentType, CustomerType, EnrichedItem, PhoneType, VehicleType } from 'src/shared/interfaces/import.interface';

dotenv.config(); // Carga las variables de entorno

@Injectable() // Permite inyección de dependencias
export class ImportService {
    constructor(
        @InjectRepository(Vehicle) // Repositorio para vehículos
        private readonly vehicleRepository: Repository<Vehicle>,
        
        @InjectRepository(Customer) // Repositorio para clientes
        private readonly customerRepository: Repository<Customer>,
        
        @InjectRepository(Appointment) // Repositorio para citas
        private readonly appointmentRepository: Repository<Appointment>,

        @InjectRepository(Phone) // Repositorio para teléfonos
        private readonly phoneRepository: Repository<Phone>,
    ) {}

    
    /**
     * Enriquece un conjunto de datos utilizando la API de OpenAI.
     * Retorna un array de objetos enriquecidos, filtrando los que no se pudieron procesar.
     */
    async enrichData(data: any[]): Promise<any[]> {
        let goodItem = 0; // Contador para elementos procesados correctamente
        let badItem = 0; // Contador para elementos que fallaron en el procesamiento

        // Procesa todos los elementos de 'data' de manera concurrente
        const enrichedData = await Promise.all(data.map(async (item) => {
            const enrichedItem = await this.callOpenAI(item); // Llama a OpenAI para enriquecer el elemento

            if (enrichedItem) { // Si se obtuvo un resultado válido
                goodItem++; // Incrementa el contador de buenos elementos
                return this.createEnrichedObject(
                    item, 
                    this.transformToObject(enrichedItem) // Crea un objeto enriquecido
                );
            } else {
                badItem++; // Incrementa el contador de elementos fallidos
            }
        }));

        // Imprime un reporte de los elementos analizados
        console.info('Reporte de objetos analizados por Open AI: ', {
            ok: goodItem,
            notOk: badItem
        });

        // Filtra y devuelve solo los elementos enriquecidos (no undefined)
        return enrichedData.filter((item) => item !== undefined);
    }

    /**
     * Crea un objeto enriquecido combinando datos del objeto leido del CSV y el objeto enriquecido.
     * Prioriza los valores del objeto enriquecido cuando están disponibles.
     */
    private createEnrichedObject(primitiveObject: any, enrichedObject: any): EnrichedItem {
        return {
            nombre: enrichedObject.nombre || primitiveObject.Nombre,
            vehiculo: enrichedObject.vehiculo || primitiveObject.Vehiculo,
            patente: enrichedObject.patente || primitiveObject.Patente,
            fecha: enrichedObject.date || primitiveObject.Fecha,
            phone: enrichedObject.phone || primitiveObject.Telefono,
            codigoPais: enrichedObject.codigoPais || '',
            servicio: enrichedObject.servicio || primitiveObject['Servicio '],
            tipo: enrichedObject.tipo,
            modelo: enrichedObject.modelo,
            marca: enrichedObject.marca
        };
    }

    /**
     * Transforma una cadena de texto en formato JSON a un objeto JavaScript.
     * Asegura que las claves estén correctamente formateadas con comillas.
     */
    private transformToObject(input: string) {
        const jsonString = input
            .replace(/(\w+):/g, '"$1":') // Agrega comillas a las claves
            .replace(/'/g, '"'); // Reemplaza comillas simples por comillas dobles

        return JSON.parse(jsonString); // Convierte la cadena JSON a un objeto
    }

    /**
     * Realiza una llamada asíncrona a la API de OpenAI para obtener una respuesta basada en el prompt.
     * Implementa reintentos en caso de error, con un tiempo de espera entre intentos.
     */
    private async callOpenAI(item: any): Promise<string> {
        const prompt = this.createPrompt(item);
        const maxRetries = 3;
        const delayBetweenRetries = 2000; // 2 segundos de espera entre reintentos

        for (let attempt = 0; attempt < maxRetries; attempt++) {
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
                    timeout: 60000 // 60 segundos de tiempo de espera para la respuesta
                });

                return response.data.choices[0].message.content;
            } catch (error) {
                console.error(`Error al llamar a OpenAI (intento ${attempt + 1}):`);

                // Si es el último intento, lanza el error
                if (attempt === maxRetries - 1) {
                    return null; // Manejo de errores
                }

                // Espera antes de reintentar
                await new Promise(resolve => setTimeout(resolve, delayBetweenRetries));
            }
        }

        return null; // En caso de que no se logre obtener una respuesta
    }

    /**
     * Crea un prompt para enriquecer la información del objeto.
     * El prompt especifica los datos que se deben incluir en la respuesta.
     */
    private createPrompt(item: any): string {
        return `Enriquece la siguiente información y dame en una propiedad dentro del objeto indicando si es persona o empresa, codigo de pais (phone), y phone aparte, modelo y marca: ${JSON.stringify(item)}. Todo debes darmelo de la siguiente manera: {
            nombre: '',
            phone: '',
            codigoPais: '',
            vehiculo: '',
            patente: '',
            servicio: '',
            date: '',
            tipo: '',
            modelo: '',
            marca: ''
        }
        Si no conocer la marca y modelo, dedúcelo a través del campo vehículo, sino, dame en el campo modelo y marca, lo mismo que en el campo vehiculo    
        `;
    }

    /**
     * Guarda un array de objetos enriquecidos en la base de datos.
     * Procesa cada objeto para manejar clientes, vehículos, teléfonos y citas.
     */
    public async saveToDatabase(data: EnrichedItem[]): Promise<void> {
        for (const item of data) {
            const customer = await this.handleCostumer(item);
            const vehicle = await this.handleVehicle(item, customer);
            if (item.phone && item.codigoPais) {
                await this.handlePhone(item, customer);
                if (item.fecha) {
                    await this.handleAppoinment(item, customer, vehicle);
                }
            }
        }
        console.log('Datos guardados en la base de datos');
    }

    /**
     * Maneja la creación o recuperación de un cliente en la base de datos.
     */
    private async handleCostumer(item: EnrichedItem): Promise<CustomerType> {
        let customer = await this.customerRepository.findOne({ where: { name: item.nombre } });
        try {
            if (!customer) {
                customer = this.customerRepository.create({
                    name: item.nombre,
                    alias: item.nombre,
                    is_company: item.tipo === 'empresa',
                });
                await this.customerRepository.save(customer);
            }
            return customer;
        } catch (error) {
            console.error('Ocurrió un error creando el cliente...', error);
        }
    }

    /**
     * Maneja la creación o recuperación de un vehículo en la base de datos.
     */
    private async handleVehicle(item: EnrichedItem, customer: CustomerType): Promise<VehicleType> {
        let vehicle = await this.vehicleRepository.findOne({ where: { plate: item.patente } });
        try {
            if (!vehicle) {
                vehicle = this.vehicleRepository.create({
                    brand: item.marca,
                    model: item.modelo || '',
                    plate: item.patente,
                    customer,
                });
                await this.vehicleRepository.save(vehicle);
            }
            return vehicle;
        } catch (error) {
            console.error('Ocurrió un error creando el vehiculo...', error);
        }
    }

    /**
     * Maneja la creación o recuperación de un teléfono en la base de datos.
     */
    private async handlePhone(item: EnrichedItem, customer: CustomerType): Promise<PhoneType> {
        let phone = await this.phoneRepository.findOne({ where: { number: item.phone } });
        try {
            if (!phone) {
                phone = this.phoneRepository.create({
                    country_code: item.codigoPais,
                    number: item.phone,
                    customer,
                });
                await this.phoneRepository.save(phone);
            }
            return phone;
        } catch (error) {
            console.error('Ocurrió un error creando el teléfono...', error);
        }
    }

    /**
     * Maneja la creación o recuperación de una cita en la base de datos.
     * Asocia la cita con un cliente y un vehículo.
     */
    private async handleAppoinment(item: EnrichedItem, customer: CustomerType, vehicle: VehicleType): Promise<AppointmentType> {
        let appointment = await this.appointmentRepository.findOne({ where: {
            type: item.servicio,
            customer,
            vehicle
        } });
        try {
            if (!appointment) {
                const parsedDate = new Date(item.fecha);

                if (isNaN(parsedDate.getTime())) {
                    return;
                }

                appointment = this.appointmentRepository.create({
                    type: item.servicio,
                    date: parsedDate,
                    vehicle,
                    customer,
                });
                await this.appointmentRepository.save(appointment);
            }
            return appointment;
        } catch (error) {
            console.error('Ocurrió un error creando la cita...', error);
        }
    }

    /**
     * Lee un archivo CSV y devuelve los datos en forma de array.
     * Utiliza un flujo legible para procesar el contenido del archivo.
     */
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