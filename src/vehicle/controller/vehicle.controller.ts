import { Request, Response } from 'express';
import { VehicleService } from '@/vehicle/service/interface/vehicle.service';
import { VehicleServiceImpl } from '@/vehicle/service/impl/vehicle.service.impl';
import { VehicleRequestDto } from '@/vehicle/dto/vehicle-request.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

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
                const errorMessages = errors.map(error => 
                    Object.values(error.constraints || {}).join(', ')
                ).join('; ');
                
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errorMessages
                });
                return;
            }

            const vehicle = await this.vehicleService.create(vehicleDto);
            
            res.status(201).json({
                success: true,
                message: 'Vehicle created successfully',
                data: vehicle
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('already exists')) {
                res.status(409).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid vehicle ID'
                });
                return;
            }

            const vehicle = await this.vehicleService.findById(id);

            if (!vehicle) {
                res.status(404).json({
                    success: false,
                    message: 'Vehicle not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Vehicle found',
                data: vehicle
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    findByLicensePlate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { licensePlate } = req.params;

            if (!licensePlate) {
                res.status(400).json({
                    success: false,
                    message: 'License plate is required'
                });
                return;
            }

            const vehicle = await this.vehicleService.findByLicensePlate(licensePlate.toUpperCase());

            if (!vehicle) {
                res.status(404).json({
                    success: false,
                    message: 'Vehicle not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Vehicle found',
                data: vehicle
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid vehicle ID'
                });
                return;
            }

            const vehicleDto = plainToClass(VehicleRequestDto, req.body);
            const errors = await validate(vehicleDto);

            if (errors.length > 0) {
                const errorMessages = errors.map(error => 
                    Object.values(error.constraints || {}).join(', ')
                ).join('; ');
                
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errorMessages
                });
                return;
            }

            const vehicle = await this.vehicleService.update(id, vehicleDto);
            
            res.status(200).json({
                success: true,
                message: 'Vehicle updated successfully',
                data: vehicle
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        success: false,
                        message: error.message
                    });
                    return;
                }
                
                if (error.message.includes('already exists')) {
                    res.status(409).json({
                        success: false,
                        message: error.message
                    });
                    return;
                }
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid vehicle ID'
                });
                return;
            }

            await this.vehicleService.delete(id);
            
            res.status(200).json({
                success: true,
                message: 'Vehicle deleted successfully'
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    getPage = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;

            if (page < 1 || pageSize < 1 || pageSize > 100) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid pagination parameters. Page must be >= 1 and pageSize between 1 and 100'
                });
                return;
            }

            const vehicles = await this.vehicleService.getPage(page, pageSize);
            
            res.status(200).json({
                success: true,
                message: 'Vehicles retrieved successfully',
                data: vehicles,
                pagination: {
                    page,
                    pageSize,
                    total: vehicles.length
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
}
