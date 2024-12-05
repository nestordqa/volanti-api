import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { CostumerModule } from './costumer/costumer.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { PhoneModule } from './phone/phone.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ImportModule } from './import/import.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './costumer/costumer.entity';
import { Vehicle } from './vehicle/vehicle.entity';
import { Phone } from './phone/phone.entity';
import { Appointment } from './appointment/appointment.entity';

dotenv.config(); // Carga las variables de entorno
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [Customer, Vehicle, Phone, Appointment],
            synchronize: true,
        }),
        CostumerModule, 
        VehicleModule, 
        PhoneModule, 
        AppointmentModule, 
        ImportModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
