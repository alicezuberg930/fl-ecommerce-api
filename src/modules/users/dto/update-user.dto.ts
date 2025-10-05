import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryAddress } from './create-delivery.address.dto';
import { CreateUserData } from './create-user.dto';

export class UpdateUserData extends PartialType(CreateUserData) {
    @IsOptional()
    balance: number

    @ValidateNested({ each: true }) // Ensures validation for each item in the array
    @Type(() => DeliveryAddress) // Specifies the class type for transformation
    @IsOptional()
    deliveryAddress: DeliveryAddress
}