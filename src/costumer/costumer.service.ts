import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../appointment/appointment.entity'; // Asegúrate de importar la entidad
import { Customer } from './costumer.entity';
import { Phone } from 'src/phone/phone.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';

/**
 * Servicio para gestionar la lógica de negocio relacionada con clientes.
 */
@Injectable()
export class CostumerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,

        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,

        @InjectRepository(Phone)
        private phoneRepository: Repository<Phone>,

        @InjectRepository(Vehicle)
        private vehicleRepository: Repository<Vehicle>,
    ) {}

    /**
     * Obtiene todos los clientes junto con sus vehículos, teléfonos y citas.
     * @returns Lista de clientes con sus relaciones.
     */
    async findAllWithRelations(): Promise<Customer[]> {
        return this.customerRepository.find({ relations: ['vehicles', 'phones', 'appointments'] });
    }

    /**
     * Obtiene un cliente por su ID, incluyendo sus vehículos, teléfonos y citas.
     * @param id Identificador del cliente.
     * @returns El cliente correspondiente al ID.
     */
    async findOneWithRelations(id: number): Promise<Customer> {
        const customer = await this.customerRepository.findOne({ where: { id }, relations: ['vehicles', 'phones', 'appointments'] });
        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }

    /**
     * Actualiza un cliente existente.
     * @param id Identificador del cliente a actualizar.
     * @param customer Datos actualizados del cliente.
     * @returns El cliente actualizado.
     */
    async update(id: number, customer: Customer): Promise<Customer> {
        await this.findOneWithRelations(id); // Verifica que el cliente existe
        await this.customerRepository.update(id, customer);
        return this.findOneWithRelations(id); // Devuelve el cliente actualizado
    }

    /**
     * Elimina un cliente por su ID.
     * @param id Identificador del cliente a eliminar.
     */
    async remove(id: number): Promise<void> {
        const customer = await this.findOneWithRelations(id); // Verifica que el cliente existe
        // Elimina las citas asociadas
        await this.appointmentRepository.delete({ customer: { id } });
        // Elimina los telefonos asociados
        await this.phoneRepository.delete({ customer: { id } });
        // Elimina los vehiculos asociados
        await this.vehicleRepository.delete({ customer: { id } });
        await this.customerRepository.remove(customer);
    }
}