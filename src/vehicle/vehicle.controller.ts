import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle.entity';

/**
 * Controlador para gestionar vehículos.
 * Permite realizar operaciones CRUD sobre la entidad Vehicle.
 */
@Controller('vehicles')
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) {}

    /**
     * Obtiene todos los vehículos junto con sus clientes y citas.
     * @returns Lista de vehículos con sus relaciones.
     */
    @Get()
    async findAll(): Promise<Vehicle[]> {
        return this.vehicleService.findAllWithRelations();
    }

    /**
     * Obtiene un vehículo por su ID, incluyendo su cliente y citas.
     * @param id Identificador del vehículo.
     * @returns El vehículo correspondiente al ID.
     */
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Vehicle> {
        return this.vehicleService.findOneWithRelations(id);
    }

    /**
     * Actualiza un vehículo existente.
     * @param id Identificador del vehículo a actualizar.
     * @param vehicle Datos actualizados del vehículo.
     * @returns El vehículo actualizado.
     */
    @Put(':id')
    async update(@Param('id') id: number, @Body() vehicle: Vehicle): Promise<Vehicle> {
        return this.vehicleService.update(id, vehicle);
    }

    /**
     * Elimina un vehículo por su ID.
     * @param id Identificador del vehículo a eliminar.
     * @returns Mensaje de confirmación.
     */
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<string> {
        await this.vehicleService.remove(id);
        return `Vehicle with ID ${id} has been removed`;
    }
}