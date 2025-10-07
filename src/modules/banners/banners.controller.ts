import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, InternalServerErrorException } from '@nestjs/common'
import { BannersService } from './banners.service'
import { BannerData } from './dto/create-banner.dto'
import { UpdateBannerData } from './dto/update-banner.dto'
import { Public, ResponseMessage } from '../../common/decorators/public.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '../../common/helpers/options/multer.options'

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) { }

  @ResponseMessage('Tạo banner thành công')
  @Post()
  @UseInterceptors(FileInterceptor("image", multerOptions({ allowedFields: [] })))
  create(@UploadedFile() file: Express.Multer.File, @Body() data: BannerData) {
    return this.bannersService.create(data, file)
  }

  @ResponseMessage('Lấy thông tin banner thành công')
  @Public()
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
  update(@Param('id') id: string, @Body() data: UpdateBannerData) {
    return this.bannersService.update(id, data)
  }

  @ResponseMessage('Xóa banner thành công')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannersService.remove(id)
  }
}
