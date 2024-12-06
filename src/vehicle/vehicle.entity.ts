import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Appointment } from '../appointment/appointment.entity';
import { Customer } from 'src/costumer/costumer.entity';

/**
 * Representa un vehículo en el sistema.
 * Cada vehículo está asociado a un cliente y puede tener múltiples citas.
 */
@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number; // Identificador único del vehículo

    @Column()
    brand: string; // Marca del vehículo

    @Column()
    model: string; // Modelo del vehículo

    @Column()
    plate: string; // Matrícula del vehículo

    @ManyToOne(() => Customer, customer => customer.vehicles)
    customer: Customer; // Relación con el cliente asociado al vehículo

    @OneToMany(() => Appointment, appointment => appointment.vehicle)
    appointments: Appointment[]; // Relación uno a muchos con las citas asociadas al vehículo
}