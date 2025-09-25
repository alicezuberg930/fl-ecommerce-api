import { IsNotEmpty, IsOptional } from "class-validator";

export class MGEData {
    @IsNotEmpty({ message: "Governor ID cannot be empty" })
    governorId: string

    @IsNotEmpty({ message: "Governor Name cannot be empty" })
    governorName: string

    @IsNotEmpty({ message: "Combat type specialty cannot be empty" })
    combatTypeSpecialty: string

    @IsNotEmpty({ message: "Unit type specialty cannot be empty" })
    unitTypeSpecialty: string

    @IsNotEmpty({ message: "Commander name cannot be empty" })
    commanderName: string

    @IsNotEmpty({ message: "VIP level cannot be empty" })
    vipLevel: string

    @IsOptional()
    otherInfo: string
}
