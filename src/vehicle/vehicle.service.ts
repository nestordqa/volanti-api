import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';

/**
 * Servicio para gestionar la lógica de negocio relacionada con vehículos.
 */
@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(Vehicle)
        private vehicleRepository: Repository<Vehicle>,
    ) {}

    /**
     * Obtiene todos los vehículos junto con sus clientes y citas.
     * @returns Lista de vehículos con sus relaciones.
     */
    async findAllWithRelations(): Promise<Vehicle[]> {
        return this.vehicleRepository.find({ relations: ['customer', 'appointments'] });
    }

    /**
     * Crea un nuevo vehículo.
     * @param vehicle Datos del vehículo a crear.
     * @returns El vehículo creado.
     */
    async create(vehicle: Vehicle): Promise<Vehicle> {
        return this.vehicleRepository.save(vehicle);
    }

    /**
     * Obtiene un vehículo por su ID, incluyendo su cliente y citas.
     * @param id Identificador del vehículo.
     * @returns El vehículo correspondiente al ID.
     */
    async findOneWithRelations(id: number): Promise<Vehicle> {
        return this.vehicleRepository.findOne({ where: { id }, relations: ['customer', 'appointments'] });
    }
}