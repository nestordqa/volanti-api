import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Appointment } from '../appointment/appointment.entity';
import { Customer } from 'src/costumer/costumer.entity';

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    brand: string;

    @Column()
    model: string;

    @Column()
    plate: string;

    @ManyToOne(() => Customer, customer => customer.vehicles)
    customer: Customer;

    @OneToMany(() => Appointment, appointment => appointment.vehicle)
    appointments: Appointment[]; // Aquí se define la relación
}