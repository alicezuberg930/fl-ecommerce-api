import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, Length, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { addressTypes } from './enum';
import { DeliveryAddressDto } from './delivery.address.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    balance: number

    @ValidateNested({ each: true }) // Ensures validation for each item in the array
    @Type(() => DeliveryAddressDto) // Specifies the class type for transformation
    @IsOptional()
    deliveryAddress: DeliveryAddressDto
}