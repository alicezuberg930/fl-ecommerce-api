import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryAddressData } from './create-delivery.address.dto';
import { CreateUserData } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserData) {
    @IsOptional()
    balance: number

    @ValidateNested({ each: true }) // Ensures validation for each item in the array
    @Type(() => DeliveryAddressData) // Specifies the class type for transformation
    @IsOptional()
    deliveryAddress: DeliveryAddressData
}