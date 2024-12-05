import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Phone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    country_code: string;

    @Column()
    number: string;
}