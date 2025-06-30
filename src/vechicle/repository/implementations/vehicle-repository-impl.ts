import { Repository } from "typeorm";
import { VehicleRepository } from "@/vechicle/repository/interface/vehicle-repository";
import { Vehicle } from "@/vechicle/entity/vehicle";
import { AppDataSource } from "@/database/db";

export class VehicleRepositoryImpl implements VehicleRepository {
  private repository: Repository<Vehicle>;

  constructor() {
    this.repository = AppDataSource.getRepository(Vehicle);
  }

  async findById(id: number): Promise<Vehicle | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    return await this.repository.findOne({
      where: { licensePlate },
    });
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    return await this.repository.save(vehicle);
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getPage(page: number, pageSize: number): Promise<Vehicle[]> {
    const skip = (page - 1) * pageSize;

    return await this.repository.find({
      skip,
      take: pageSize,
      order: {
        createdAt: "DESC",
      },
    });
  }
}
