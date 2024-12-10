import { Module } from '@nestjs/common';
import { CostumerController } from './costumer.controller';
import { CostumerService } from './costumer.service';
import { Appointment } from 'src/appointment/appointment.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';
import { Customer } from './costumer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phone } from 'src/phone/phone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Vehicle, Appointment, Phone])],
  controllers: [CostumerController],
  providers: [CostumerService]
})
export class CostumerModule {}
