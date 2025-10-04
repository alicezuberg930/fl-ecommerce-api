import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LocationDocument = HydratedDocument<Location>

class Ward {
    @Prop()
    type: string

    @Prop()
    codeName: string

    @Prop()
    code: string

    @Prop()
    name: string

    @Prop()
    fullName: string

    @Prop()
    districtCode: string
}

class District {
    @Prop()
    type: string

    @Prop()
    codeName: string

    @Prop()
    code: string

    @Prop()
    name: string

    @Prop()
    fullName: string

    @Prop()
    provinceCode: string

    @Prop({ type: [Ward] })
    ward: Ward[]
}

@Schema({ timestamps: true })
export class Location {
    @Prop()
    type: string

    @Prop()
    codeName: string

    @Prop()
    code: string

    @Prop()
    name: string

    @Prop()
    fullName: string

    @Prop({ type: [District] })
    district: District[]
}

export const LocationSchema = SchemaFactory.createForClass(Location)