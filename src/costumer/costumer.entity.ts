import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Vehicle } from '../vehicle/vehicle.entity';
import { Phone } from '../phone/phone.entity';
import { Appointment } from '../appointment/appointment.entity';

/**
 * Representa un cliente en el sistema.
 * Cada cliente puede tener múltiples vehículos, teléfonos y citas.
 */
@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number; // Identificador único del cliente

    @Column()
    name: string; // Nombre del cliente

    @Column()
    alias: string; // Alias o nombre alternativo del cliente

    @Column()
    is_company: boolean; // Indica si el cliente es una empresa (true) o una persona (false)

    @OneToMany(() => Vehicle, vehicle => vehicle.customer)
    vehicles: Vehicle[]; // Relación uno a muchos con los vehículos asociados al cliente

    @OneToMany(() => Phone, phone => phone.customer)
    phones: Phone[]; // Relación uno a muchos con los teléfonos asociados al cliente

    @OneToMany(() => Appointment, appointment => appointment.customer)
    appointments: Appointment[]; // Relación uno a muchos con las citas asociadas al cliente
}