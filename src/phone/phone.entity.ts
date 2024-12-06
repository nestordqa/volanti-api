import { Customer } from 'src/costumer/costumer.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

/**
 * Representa un número de teléfono asociado a un cliente en el sistema.
 * Cada número de teléfono está vinculado a un único cliente.
 */
@Entity()
export class Phone {
    @PrimaryGeneratedColumn()
    id: number; // Identificador único del número de teléfono

    @Column()
    country_code: string; // Código de país del número de teléfono

    @Column()
    number: string; // Número de teléfono

    @ManyToOne(() => Customer, customer => customer.phones)
    customer: Customer; // Relación con el cliente asociado al número de teléfono
}