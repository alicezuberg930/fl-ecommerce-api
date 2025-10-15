import { IsEnum, IsOptional } from "class-validator"
import { Provider } from "../../../modules/users/schemas/enum"

export class LoginData {
    @IsOptional()
    email: string

    @IsOptional()
    password: string

    @IsEnum(Provider, { message: 'Provider cannot be empty' })
    provider: string

    @IsOptional()
    name: string

    @IsOptional()
    avatar: string
}
