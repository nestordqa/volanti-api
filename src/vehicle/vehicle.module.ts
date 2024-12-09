import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle.entity';
import { Customer } from 'src/costumer/costumer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Customer, Vehicle])],
    controllers: [VehicleController],
    providers: [VehicleService]
})
export class VehicleModule {}
