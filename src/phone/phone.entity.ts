import { Customer } from 'src/costumer/costumer.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Phone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    country_code: string;

    @Column()
    number: string;

    @ManyToOne(() => Customer, customer => customer.phones)
    customer: Customer;
}