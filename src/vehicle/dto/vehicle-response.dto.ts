import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class VehicleResponseDto {

    @Expose()
    id: number;

    @Expose()
    licensePlate: string;

    @Expose()
    createdAt: Date;

    @Expose()   
    updatedAt: Date;
}