import { Vehicle } from "@/vechicle/entity/vehicle";

export interface VehicleRepository {
    findById(id: number): Promise<Vehicle | null>;
    findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
    save(vehicle: Vehicle): Promise<Vehicle>;
    deleteById(id: number): Promise<void>;
    getPage(page: number, pageSize: number): Promise<Vehicle[]>;
}