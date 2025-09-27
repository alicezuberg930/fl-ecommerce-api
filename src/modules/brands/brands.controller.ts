import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException } from '@nestjs/common'
import { BrandService } from './brands.service'
import { ResponseMessage } from 'src/common/decorators/public.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { BrandData } from './dto/create-brand.dto';
import { multerOptions } from 'src/common/helpers/options/multer.options';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandsService: BrandService) { }

  @ResponseMessage('Brand created successfully')
  @Post()
  @UseInterceptors(FileInterceptor("logo", multerOptions({ allowedFields: [] })))
  async create(@UploadedFile() file: Express.Multer.File, @Body() data: BrandData) {
    return this.brandsService.create(data, file)
  }

  @ResponseMessage('Brand list retrieved successfully')
  @Get()
  findAll() {
    return this.brandsService.findAll()
  }

  @ResponseMessage('Brand details retrieved successfully')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id)
  }

  @ResponseMessage('Brand updated successfully')
  @Patch(':id')
  @UseInterceptors(FileInterceptor("logo", multerOptions({ allowedFields: [] })))
  update(@Param('id') id: string, @Body() data: BrandData, @UploadedFile() file: Express.Multer.File) {
    return this.brandsService.update(id, data, file)
  }

  @ResponseMessage('Brand deleted successfully')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id)
  }
}
