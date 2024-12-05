import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Vehicle } from '../vehicle/vehicle.entity';
import { Customer } from 'src/costumer/costumer.entity';

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string; // Enum puede ser implementado más adelante

    @Column()
    date: Date;

    @ManyToOne(() => Customer, customer => customer.appointments)
    customer: Customer;

    @ManyToOne(() => Vehicle, vehicle => vehicle.appointments)
    vehicle: Vehicle;
}