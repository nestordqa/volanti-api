import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/costumer/costumer.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';
import { Phone } from 'src/phone/phone.entity';
import { Appointment } from 'src/appointment/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Vehicle, Phone, Appointment])],
  providers: [ImportService],
  controllers: [ImportController]
})
export class ImportModule {}
