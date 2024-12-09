import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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
     * Crea un nuevo vehículo.
     * @param vehicle Datos del vehículo a crear.
     * @returns El vehículo creado.
     */
    @Post()
    async create(@Body() vehicle: Vehicle): Promise<Vehicle> {
        return this.vehicleService.create(vehicle);
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
}