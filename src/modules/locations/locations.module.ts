import { Module } from '@nestjs/common';
import { LocationService } from './locations.service';
import { LocationController } from './locations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Location, LocationSchema } from './shemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]),
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule { }