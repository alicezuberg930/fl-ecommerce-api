import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ResponseMessage } from 'src/common/decorators/public.decorator'
import { ProductData } from './dto/create-product.dto'
import { UpdatePostData } from './dto/update-product.dto'
import { QueryProduct } from './dto/query-product'
import { FilesInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'src/common/helpers/options/multer.options'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @ResponseMessage('Product created successfully')
  @UseInterceptors(FilesInterceptor("images", Infinity, multerOptions({ allowedFields: [] })))
  @Post()
  create(@UploadedFiles() files: Express.Multer.File[], @Body() data: ProductData) {
    return this.productsService.create(data, files)
  }

  @ResponseMessage('Product list fetched successfully')
  @Get()
  findAll(@Query() query: QueryProduct) {
    return this.productsService.findAll(query)
  }

  @ResponseMessage('Product details fetched successfully')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id)
  }

  @ResponseMessage('Product updated successfully')
  @Patch(':id')
  update(@Param('id') id: string, @Body() postData: UpdatePostData) {
    return this.productsService.update(id, postData)
  }

  @ResponseMessage('Product deleted successfully')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id)
  }
}
