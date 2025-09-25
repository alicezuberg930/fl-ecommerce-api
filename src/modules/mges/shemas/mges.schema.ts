import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type MGEDocument = HydratedDocument<MGE>

@Schema({ timestamps: true })
export class MGE {
    @Prop()
    governorId: number

    @Prop()
    governorName: string

    @Prop()
    profileImage: string

    @Prop()
    unitTypeSpecialty: string[]

    @Prop()
    combatTypeSpecialty: string[]

    @Prop()
    commanderName: string

    @Prop()
    vipLevel: number

    @Prop()
    equipmentImage: string

    @Prop()
    resourcesImage: string

    @Prop()
    speedupsImage: string

    @Prop()
    otherInfo: string
}

export const MGESchema = SchemaFactory.createForClass(MGE)