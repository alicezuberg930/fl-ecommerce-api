import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CartsService } from './carts.service'
import { CartData } from './dto/create-cart.dto'
import { UpdateCartData } from './dto/update-cart.dto'
import { ResponseMessage } from '../../common/decorators/public.decorator'
import { CurrentUser } from '../../common/decorators/id.decorator'

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @ResponseMessage('Cart item added successfully')
  @Post()
  create(@Body() data: CartData, @CurrentUser('_id') userId: string) {
    return this.cartsService.create(data, userId)
  }

  @ResponseMessage('Cart items fetched successfully')
  @Get()
  findAll(@CurrentUser('_id') userId: string) {
    return this.cartsService.findAll(userId)
  }

  @ResponseMessage('Cart details fetched successfully')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(id)
  }

  @ResponseMessage('Cart item updated successfully')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCartData) {
    return this.cartsService.update(id, data)
  }

  @ResponseMessage('Cart item deleted successfully')
  @Delete()
  remove(@Body() data: { id: string | string[] }) {
    return this.cartsService.remove(data.id)
  }
}
