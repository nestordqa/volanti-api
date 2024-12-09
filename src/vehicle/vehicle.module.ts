import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle.entity';
import { Customer } from 'src/costumer/costumer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/appointment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Customer, Vehicle, Appointment])],
    controllers: [VehicleController],
    providers: [VehicleService]
})
export class VehicleModule {}
