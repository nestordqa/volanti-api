import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { Phone } from './phone.entity';

/**
 * Controlador para gestionar números de teléfono.
 * Permite realizar operaciones CRUD sobre la entidad Phone.
 */
@Controller('phones')
export class PhoneController {
    constructor(private readonly phoneService: PhoneService) {}

    /**
     * Obtiene todos los números de teléfono junto con sus clientes.
     * @returns Lista de números de teléfono con sus relaciones.
     */
    @Get()
    async findAll(): Promise<Phone[]> {
        return this.phoneService.findAllWithRelations();
    }

    /**
     * Obtiene un número de teléfono por su ID, incluyendo su cliente.
     * @param id Identificador del número de teléfono.
     * @returns El número de teléfono correspondiente al ID.
     */
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Phone> {
        return this.phoneService.findOneWithRelations(id);
    }

    /**
     * Actualiza un número de teléfono existente.
     * @param id Identificador del número de teléfono a actualizar.
     * @param phone Datos actualizados del número de teléfono.
     * @returns El número de teléfono actualizado.
     */
    @Put(':id')
    async update(@Param('id') id: number, @Body() phone: Phone): Promise<Phone> {
        return this.phoneService.update(id, phone);
    }

    /**
     * Elimina un número de teléfono por su ID.
     * @param id Identificador del número de teléfono a eliminar.
     * @returns Mensaje de confirmación.
     */
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<string> {
        await this.phoneService.remove(id);
        return `Phone with ID ${id} has been removed`;
    }
}