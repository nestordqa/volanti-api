import { Module } from '@nestjs/common';
import { CostumerModule } from './costumer/costumer.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { PhoneModule } from './phone/phone.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [CostumerModule, VehicleModule, PhoneModule, AppointmentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
