import { Request, Response } from "express";
import { VehicleService } from "@/vehicle/service/interface/vehicle.service";
import { VehicleServiceImpl } from "@/vehicle/service/impl/vehicle.service.impl";
import { VehicleRequestDto } from "@/vehicle/dto/vehicle-request.dto";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from "@/exceptions";

export class VehicleController {
  private vehicleService: VehicleService;

  constructor() {
    this.vehicleService = new VehicleServiceImpl();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const vehicleDto = plainToClass(VehicleRequestDto, req.body);
      const errors = await validate(vehicleDto);

      if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints || {}).join(", ")
        );
        throw new BadRequestException("Validation failed", errorMessages);
      }

      const vehicle = await this.vehicleService.create(vehicleDto);

      res.status(201).json(vehicle);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        throw new ConflictException(error.message);
      }

      if (
        !(
          error instanceof BadRequestException ||
          error instanceof ConflictException
        )
      ) {
        throw new InternalServerErrorException(
          error instanceof Error ? error.message : "Unknown error"
        );
      }

      throw error;
    }
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new BadRequestException("Invalid vehicle ID");
      }

      const vehicle = await this.vehicleService.findById(id);

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with id ${id} not found`);
      }

      res.status(200).json(vehicle);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  findByLicensePlate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { licensePlate } = req.params;

      if (!licensePlate) {
        throw new BadRequestException("License plate is required");
      }

      const vehicle = await this.vehicleService.findByLicensePlate(
        licensePlate.toUpperCase()
      );

      if (!vehicle) {
        throw new NotFoundException(
          `Vehicle with license plate ${licensePlate.toUpperCase()} not found`
        );
      }

      res.status(200).json(vehicle);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new BadRequestException("Invalid vehicle ID");
      }

      const vehicleDto = plainToClass(VehicleRequestDto, req.body);
      const errors = await validate(vehicleDto);

      if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints || {}).join(", ")
        );

        throw new BadRequestException("Validation failed", errorMessages);
      }

      const vehicle = await this.vehicleService.update(id, vehicleDto);

      res.status(200).json(vehicle);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          throw new NotFoundException(error.message);
        }

        if (error.message.includes("already exists")) {
          throw new ConflictException(error.message);
        }
      }
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new BadRequestException("Invalid vehicle ID");
      }

      await this.vehicleService.delete(id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw new NotFoundException(error.message);
      }

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  getPage = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      if (page < 1 || pageSize < 1 || pageSize > 100) {
        throw new BadRequestException(
          "Invalid pagination parameters. Page must be >= 1 and pageSize between 1 and 100"
        );
      }

      const vehicles = await this.vehicleService.getPage(page, pageSize);
      
      const response = {
        data: vehicles,
        page: {
          current: page,
          size: pageSize,
          total: vehicles.length
        }
      };
      
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };
}
