import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Vehicle } from '../vehicle/vehicle.entity';
import { Phone } from '../phone/phone.entity';
import { Appointment } from '../appointment/appointment.entity';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    alias: string;

    @Column()
    is_company: boolean;

    @OneToMany(() => Vehicle, vehicle => vehicle.customer)
    vehicles: Vehicle[];

    @OneToMany(() => Phone, phone => phone.customer)
    phones: Phone[];

    @OneToMany(() => Appointment, appointment => appointment.customer)
    appointments: Appointment[];
}