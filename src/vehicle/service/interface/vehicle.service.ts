import { VehicleRequestDto } from "@/vehicle/dto/vehicle-request.dto";
import { VehicleResponseDto } from "@/vehicle/dto/vehicle-response.dto";

export interface VehicleService {
    create(vehicleDto: VehicleRequestDto): Promise<VehicleResponseDto>;
    findById(id: number): Promise<VehicleResponseDto | null>;
    findByLicensePlate(licensePlate: string): Promise<VehicleResponseDto | null>;
    update(id: number, vehicleDto: VehicleRequestDto): Promise<VehicleResponseDto>;
    delete(id: number): Promise<void>;
    getPage(page: number, pageSize: number): Promise<VehicleResponseDto[]>;
}