import { VehicleService } from "@/vehicle/service/interface/vehicle.service";
import { VehicleRepository } from "@/vehicle/repository/interface/vehicle.repository";
import { VehicleRepositoryImpl } from "@/vehicle/repository/implementations/vehicle.repository.impl";
import { VehicleRequestDto } from "@/vehicle/dto/vehicle-request.dto";
import { VehicleResponseDto } from "@/vehicle/dto/vehicle-response.dto";
import { Vehicle } from "@/vehicle/entity/vehicle.entity";
import { plainToClass } from "class-transformer";

export class VehicleServiceImpl implements VehicleService {
    private vehicleRepository: VehicleRepository;

    constructor() {
        this.vehicleRepository = new VehicleRepositoryImpl();
    }

    async create(vehicleDto: VehicleRequestDto): Promise<VehicleResponseDto> {
        // Verificar si ya existe un vehículo con esa placa
        const existingVehicle = await this.vehicleRepository.findByLicensePlate(vehicleDto.licensePlate);
        if (existingVehicle) {
            throw new Error(`Vehicle with license plate ${vehicleDto.licensePlate} already exists`);
        }

        const vehicle = new Vehicle();
        vehicle.licensePlate = vehicleDto.licensePlate;

        const savedVehicle = await this.vehicleRepository.save(vehicle);

        return plainToClass(VehicleResponseDto, savedVehicle, {
            excludeExtraneousValues: true
        });
    }

    async findById(id: number): Promise<VehicleResponseDto | null> {
        const vehicle = await this.vehicleRepository.findById(id);
        if (!vehicle) {
            return null;
        }

        return plainToClass(VehicleResponseDto, vehicle, {
            excludeExtraneousValues: true
        });
    }

    async findByLicensePlate(licensePlate: string): Promise<VehicleResponseDto | null> {
        const vehicle = await this.vehicleRepository.findByLicensePlate(licensePlate);
        if (!vehicle) {
            return null;
        }

        return plainToClass(VehicleResponseDto, vehicle, {
            excludeExtraneousValues: true
        });
    }

    async update(id: number, vehicleDto: VehicleRequestDto): Promise<VehicleResponseDto> {
        // Verificar que el vehículo existe
        const existingVehicle = await this.vehicleRepository.findById(id);
        if (!existingVehicle) {
            throw new Error(`Vehicle with id ${id} not found`);
        }

        // Verificar que no existe otro vehículo con la misma placa
        const vehicleWithSamePlate = await this.vehicleRepository.findByLicensePlate(vehicleDto.licensePlate);
        if (vehicleWithSamePlate && vehicleWithSamePlate.id !== id) {
            throw new Error(`Vehicle with license plate ${vehicleDto.licensePlate} already exists`);
        }

        // Actualizar los datos
        existingVehicle.licensePlate = vehicleDto.licensePlate;

        // Guardar cambios
        const updatedVehicle = await this.vehicleRepository.save(existingVehicle);

        return plainToClass(VehicleResponseDto, updatedVehicle, {
            excludeExtraneousValues: true
        });
    }

    async delete(id: number): Promise<void> {
        // Verificar que el vehículo existe
        const existingVehicle = await this.vehicleRepository.findById(id);
        if (!existingVehicle) {
            throw new Error(`Vehicle with id ${id} not found`);
        }

        await this.vehicleRepository.deleteById(id);
    }

    async getPage(page: number, pageSize: number): Promise<VehicleResponseDto[]> {
        const vehicles = await this.vehicleRepository.getPage(page, pageSize);

        return vehicles.map(vehicle => 
            plainToClass(VehicleResponseDto, vehicle, {
                excludeExtraneousValues: true
            })
        );
    }
}