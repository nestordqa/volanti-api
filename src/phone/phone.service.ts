import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phone } from './phone.entity';

/**
 * Servicio para gestionar la lógica de negocio relacionada con números de teléfono.
 */
@Injectable()
export class PhoneService {
    constructor(
        @InjectRepository(Phone)
        private phoneRepository: Repository<Phone>,
    ) {}

    /**
     * Obtiene todos los números de teléfono junto con sus clientes.
     * @returns Lista de números de teléfono con sus relaciones.
     */
    async findAllWithRelations(): Promise<Phone[]> {
        return this.phoneRepository.find({ relations: ['customer'] });
    }

    /**
     * Obtiene un número de teléfono por su ID, incluyendo su cliente.
     * @param id Identificador del número de teléfono.
     * @returns El número de teléfono correspondiente al ID.
     */
    async findOneWithRelations(id: number): Promise<Phone> {
        const phone = await this.phoneRepository.findOne({ where: { id }, relations: ['customer'] });
        if (!phone) {
            throw new NotFoundException(`Phone with ID ${id} not found`);
        }
        return phone;
    }

    /**
     * Actualiza un número de teléfono existente.
     * @param id Identificador del número de teléfono a actualizar.
     * @param phone Datos actualizados del número de teléfono.
     * @returns El número de teléfono actualizado.
     */
    async update(id: number, phone: Phone): Promise<Phone> {
        await this.findOneWithRelations(id); // Verifica que el número de teléfono existe
        await this.phoneRepository.update(id, phone);
        return this.findOneWithRelations(id); // Devuelve el número de teléfono actualizado
    }

    /**
     * Elimina un número de teléfono por su ID.
     * @param id Identificador del número de teléfono a eliminar.
     */
    async remove(id: number): Promise<void> {
        const phone = await this.findOneWithRelations(id); // Verifica que el número de teléfono existe
        await this.phoneRepository.remove(phone);
    }
}