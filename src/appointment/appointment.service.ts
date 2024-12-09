import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { Vehicle } from '../vehicle/vehicle.entity'; // Asegúrate de importar la entidad

/**
 * Servicio para gestionar la lógica de negocio relacionada con citas.
 */
@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
    ) {}

    /**
     * Obtiene todas las citas junto con sus clientes y vehículos.
     * @returns Lista de citas con sus relaciones.
     */
    async findAllWithRelations(): Promise<Appointment[]> {
        return this.appointmentRepository.find({ relations: ['customer', 'vehicle'] });
    }

    /**
     * Obtiene una cita por su ID, incluyendo su cliente y vehículo.
     * @param id Identificador de la cita.
     * @returns La cita correspondiente al ID
     */
    async findOneWithRelations(id: number): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({ where: { id }, relations: ['customer', 'vehicle'] });
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${id} not found`);
        }
        return appointment;
    }

    /**
     * Actualiza una cita existente.
     * @param id Identificador de la cita a actualizar.
     * @param appointment Datos actualizados de la cita.
     * @returns La cita actualizada.
     */
    async update(id: number, appointment: Appointment): Promise<Appointment> {
        await this.findOneWithRelations(id); // Verifica que la cita existe
        await this.appointmentRepository.update(id, appointment);
        return this.findOneWithRelations(id); // Devuelve la cita actualizada
    }

    /**
     * Elimina una cita por su ID.
     * @param id Identificador de la cita a eliminar.
     */
    async remove(id: number): Promise<void> {
        const appointment = await this.findOneWithRelations(id); // Verifica que la cita existe
        await this.appointmentRepository.remove(appointment);
    }
}