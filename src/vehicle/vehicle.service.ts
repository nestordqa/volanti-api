import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Appointment } from 'src/appointment/appointment.entity';

/**
 * Servicio para gestionar la lógica de negocio relacionada con vehículos.
 */
@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(Vehicle)
        private vehicleRepository: Repository<Vehicle>,

        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
    ) {}

    /**
     * Obtiene todos los vehículos junto con sus clientes y citas.
     * @returns Lista de vehículos con sus relaciones.
     */
    async findAllWithRelations(): Promise<Vehicle[]> {
        return this.vehicleRepository.find({ relations: ['customer', 'appointments'] });
    }

    /**
     * Obtiene un vehículo por su ID, incluyendo su cliente y citas.
     * @param id Identificador del vehículo.
     * @returns El vehículo correspondiente al ID.
     */
    async findOneWithRelations(id: number): Promise<Vehicle> {
        const vehicle = await this.vehicleRepository.findOne({ where: { id }, relations: ['customer', 'appointments'] });
        if (!vehicle) {
            throw new NotFoundException(`Vehicle with ID ${id} not found`);
        }
        return vehicle;
    }

    /**
     * Actualiza un vehículo existente.
     * @param id Identificador del vehículo a actualizar.
     * @param vehicle Datos actualizados del vehículo.
     * @returns El vehículo actualizado.
     */
    async update(id: number, vehicle: Vehicle): Promise<Vehicle> {
        await this.findOneWithRelations(id); // Verifica que el vehículo existe
        await this.vehicleRepository.update(id, vehicle);
        return this.findOneWithRelations(id); // Devuelve el vehículo actualizado
    }

    /**
     * Elimina un vehículo por su ID.
     * @param id Identificador del vehículo a eliminar.
     */
    async remove(id: number): Promise<void> {
        const vehicle = await this.findOneWithRelations(id); // Verifica que el vehículo existe
        // Elimina las citas asociadas 
        await this.appointmentRepository.delete({ vehicle: { id } });
        await this.vehicleRepository.remove(vehicle);
    }
}