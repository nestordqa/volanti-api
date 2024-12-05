export interface EnrichedItem {
    nombre: string;
    vehiculo: string;
    modelo: string;
    marca: string;
    patente: string;
    fecha: string | Date;
    phone: string;
    codigoPais: string;
    servicio: string;
    tipo: string;
}

export interface CustomerType {
    id: number;
    name: string;
    alias: string;
    is_company: boolean
}

export interface VehicleType {
    id: number;
    brand: string;
    model: string;
    plate: string;
    customer: CustomerType;
}

export interface PhoneType {
    id: number;
    country_code: string;
    number: string;
    customer: CustomerType;
}

export interface AppointmentType {
    id: number;
    type: string;
    date: Date | string;
    customer: CustomerType,
    vehicle: VehicleType
}