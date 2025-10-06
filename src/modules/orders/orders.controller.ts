import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrderData } from './dto/create-order.dto'
import { UpdateOrderData } from './dto/update-order.dto'
import { CurrentUser } from 'src/common/decorators/id.decorator'
import { ResponseMessage } from 'src/common/decorators/public.decorator'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @ResponseMessage('Order created successfully')
  @Post()
  create(@Body() data: OrderData, @CurrentUser('_id') id: string) {
    return this.ordersService.create(data, id)
  }

  @ResponseMessage('Order list fetched successfully')
  @Get()
  findAll() {
    return this.ordersService.findAll()
  }

  @ResponseMessage('Order details fetched successfully')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id)
  }

  @ResponseMessage('Order updated successfully')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateOrderData) {
    return this.ordersService.update(id, data)
  }

  @ResponseMessage('Order deleted fetched successfully')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id)
  }
}
