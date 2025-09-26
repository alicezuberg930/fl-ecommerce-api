import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ResponseMessage } from 'src/common/decorators/public.decorator'
import { PostData } from './dto/create-product.dto'
import { UpdatePostData } from './dto/update-product.dto'
import { QueryProduct } from './dto/query-product'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @ResponseMessage('Tạo bài đăng thành công')
  @Post()
  create(@Body() postData: PostData) {
    return this.productsService.create(postData)
  }

  @ResponseMessage('Lấy danh sách bài đăng thành công')
  @Get()
  findAll(@Query() query: QueryProduct) {
    return this.productsService.findAll(query)
  }

  @ResponseMessage('Lấy bài đăng thành công')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id)
  }

  @ResponseMessage('Cập nhật bài đăng thành công')
  @Patch(':id')
  update(@Param('id') id: string, @Body() postData: UpdatePostData) {
    return this.productsService.update(id, postData)
  }

  @ResponseMessage('Xóa bài đăng thành công')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id)
  }
}
