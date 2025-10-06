import { IsEmail, IsNotEmpty, IsOptional, Length, Max } from 'class-validator';
import { Wallet } from '../schemas/wallet.schema';

export class CreateUserData {
    @IsNotEmpty({ message: 'User name cannot be empty' })
    name: string;

    @IsEmail({}, { message: 'User email is invalid' })
    email: string;

    @Length(6, 6, { message: 'User password need to have at least 6 characters' })
    password: string;

    @IsOptional()
    // @Length(10, 10, { message: 'User phone need to have at least 10 characters' })
    phone: string

    @IsOptional()
    address: string

    @IsOptional()
    avatar: string
}
