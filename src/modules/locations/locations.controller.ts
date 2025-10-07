import { Controller, Get, Param } from '@nestjs/common'
import { LocationService } from './locations.service'
import { Public, ResponseMessage } from '../../common/decorators/public.decorator'

@Controller('locations')
export class LocationController {
  constructor(private readonly locationsService: LocationService) { }

  @ResponseMessage('Province list fetched successfully')
  @Public()
  @Get('provinces')
  findProvinces() {
    return this.locationsService.findProvinces();
  }

  @ResponseMessage('District list fetched successfully')
  @Public()
  @Get('districts/:provinceId')
  findDistricts(@Param('provinceId') provinceId: string) {
    return this.locationsService.findDistricts(provinceId);
  }

  @ResponseMessage('Ward list fetched successfully')
  @Public()
  @Get('wards/:districtId')
  findWards(@Param('districtId') districtId: string) {
    return this.locationsService.findWards(districtId);
  }
}
