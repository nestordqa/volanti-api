import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CostumerService } from './costumer.service';
import { Customer } from './costumer.entity';

/**
 * Controlador para gestionar clientes.
 * Permite realizar operaciones CRUD sobre la entidad Customer.
 */
@Controller('customers')
export class CostumerController {
    constructor(private readonly customerService: CostumerService) {}

    /**
     * Obtiene todos los clientes junto con sus vehículos, teléfonos y citas.
     * @returns Lista de clientes con sus relaciones.
     */
    @Get()
    async findAll(): Promise<Customer[]> {
        return this.customerService.findAllWithRelations();
    }

    /**
     * Obtiene un cliente por su ID, incluyendo sus vehículos, teléfonos y citas.
     * @param id Identificador del cliente.
     * @returns El cliente correspondiente al ID.
     */
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Customer> {
        return this.customerService.findOneWithRelations(id);
    }

    /**
     * Actualiza un cliente existente.
     * @param id Identificador del cliente a actualizar.
     * @param customer Datos actualizados del cliente.
     * @returns El cliente actualizado.
     */
    @Put(':id')
    async update(@Param('id') id: number, @Body() customer: Customer): Promise<Customer> {
        return this.customerService.update(id, customer);
    }

    /**
     * Elimina un cliente por su ID.
     * @param id Identificador del cliente a eliminar.
     * @returns Mensaje de confirmación.
     */
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<string> {
        await this.customerService.remove(id);
        return `Customer with ID ${id} has been removed`;
    }
}