import { Controller, Get, Post, Delete, Body, Param, Patch, UseInterceptors, UploadedFile } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryData } from './dto/create-category.dto'
import { UpdateCategoryData } from './dto/update-category.dto'
import { Public, ResponseMessage } from 'src/common/decorators/public.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'src/common/helpers/options/multer.options'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) { }

  @ResponseMessage('Tạo ngành hàng thành công')
  @UseInterceptors(FileInterceptor('logo', multerOptions({ allowedFields: [] })))
  @Post()
  create(@UploadedFile() file: Express.Multer.File, @Body() data: CreateCategoryData) {
    return this.categoryService.create(data, file)
  }

  @ResponseMessage('Lấy danh sách ngành hàng thành công')
  @Public()
  @Get()
  findAll() {
    return this.categoryService.findAll()
  }

  @ResponseMessage('Lấy ngành hàng thành công')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id)
  }

  @ResponseMessage('Xóa ngành hàng thành công')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.delete(id)
  }

  @ResponseMessage('Sửa ngành hàng thành công')
  @UseInterceptors(FileInterceptor('logo', multerOptions({ allowedFields: [] })))
  @Patch(':id')
  update(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() categoryData: UpdateCategoryData) {
    return this.categoryService.update(id, categoryData, file)
  }
}