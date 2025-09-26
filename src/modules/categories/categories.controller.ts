import { Controller, Get, Post, Delete, Body, Param, Patch } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryData } from './dto/create-category.dto'
import { UpdateCategoryData } from './dto/update-category.dto'
import { ResponseMessage } from 'src/common/decorators/public.decorator'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) { }

  @ResponseMessage('Tạo ngành hàng thành công')
  @Post()
  create(@Body() categoryData: CreateCategoryData) {
    return this.categoryService.create(categoryData)
  }

  @ResponseMessage('Lấy danh sách ngành hàng thành công')
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() categoryData: UpdateCategoryData) {
    return this.categoryService.update(id, categoryData)
  }
}