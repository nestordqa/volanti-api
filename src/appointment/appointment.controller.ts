import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';

/**
 * Controlador para gestionar citas.
 * Permite realizar operaciones CRUD sobre la entidad Appointment.
 */
@Controller('appointments')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}

    /**
     * Obtiene todas las citas junto con sus clientes y vehículos.
     * @returns Lista de citas con sus relaciones.
     */
    @Get()
    async findAll(): Promise<Appointment[]> {
        return this.appointmentService.findAllWithRelations();
    }

    /**
     * Obtiene una cita por su ID, incluyendo su cliente y vehículo.
     * @param id Identificador de la cita.
     * @returns La cita correspondiente al ID.
     */
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Appointment> {
        return this.appointmentService.findOneWithRelations(id);
    }

    /**
     * Actualiza una cita existente.
     * @param id Identificador de la cita a actualizar.
     * @param appointment Datos actualizados de la cita.
     * @returns La cita actualizada.
     */
    @Put(':id')
    async update(@Param('id') id: number, @Body() appointment: Appointment): Promise<Appointment> {
        return this.appointmentService.update(id, appointment);
    }

    /**
     * Elimina una cita por su ID.
     * @param id Identificador de la cita a eliminar.
     * @returns Mensaje de confirmación.
     */
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<string> {
        await this.appointmentService.remove(id);
        return `Appointment with ID ${id} has been removed`;
    }
}