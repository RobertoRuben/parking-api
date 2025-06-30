import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class VehicleRequestDto {
    @IsString({ message: "The license plate must be a string." })
    @IsNotEmpty({ message: "The license plate is required." })
    @Length(1, 6, { message: "The license plate must be between 1 and 6 characters." })
    @Matches(/^[A-Z0-9-]+$/, { message: 'License plate must contain only uppercase letters, numbers, and hyphens' })
    @Transform(({ value }) => value?.toUpperCase().trim())
    licensePlate: string;
}