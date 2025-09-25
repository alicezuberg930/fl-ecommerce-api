import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { BannersService } from './banners.service'
import { BannerData } from './dto/create-banner.dto'
import { UpdateBannerData } from './dto/update-banner.dto'
import { ResponseMessage } from 'src/common/decorators/public.decorator'

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) { }

  @ResponseMessage('Tạo banner thành công')
  @Post()
  create(@Body() bannerData: BannerData) {
    return this.bannersService.create(bannerData)
  }

  @ResponseMessage('Lấy thông tin banner thành công')
  @Get()
  findAll() {
    return this.bannersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannersService.findOne(+id)
  }

  @ResponseMessage('Cập nhật banner thành công')
  @Patch(':id')
  update(@Param('id') id: string, @Body() bannerData: UpdateBannerData) {
    return this.bannersService.update(id, bannerData)
  }

  @ResponseMessage('Xóa banner thành công')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannersService.remove(id)
  }
}
