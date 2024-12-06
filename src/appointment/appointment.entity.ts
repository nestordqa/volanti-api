import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Vehicle } from '../vehicle/vehicle.entity';
import { Customer } from 'src/costumer/costumer.entity';

/**
 * Representa una cita en el sistema.
 * Cada cita está asociada a un cliente y a un vehículo.
 */
@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number; // Identificador único de la cita

    @Column()
    type: string; // Tipo de servicio de la cita (puede ser un Enum en el futuro)

    @Column()
    date: Date; // Fecha y hora de la cita

    @ManyToOne(() => Customer, customer => customer.appointments)
    customer: Customer; // Relación con el cliente asociado a la cita

    @ManyToOne(() => Vehicle, vehicle => vehicle.appointments)
    vehicle: Vehicle; // Relación con el vehículo asociado a la cita
}