import { IsEmail, IsEnum, IsNotEmpty, Length, Max } from 'class-validator';
import { Wallet } from '../schemas/wallet.schema';
import { Provider } from '../schemas/enum';

export class CreateUserData {
    @IsNotEmpty({ message: 'User name cannot be empty' })
    name: string;

    @IsEmail({}, { message: 'User email is invalid' })
    email: string;

    @Length(6, 6, { message: 'User password need to have at least 6 characters' })
    password: string;

    @IsEnum(Provider, { message: 'Provider cannot be empty' })
    provider: string
}
