import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserData } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ResponseMessage } from 'src/common/decorators/public.decorator'
import { UserQuery } from './query/user.query'
import { DeliveryAddressData } from './dto/create-delivery.address.dto'
import { CurrentUser } from 'src/common/decorators/id.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ResponseMessage('Registered successfully')
  @Post()
  create(@Body() data: CreateUserData) {
    return this.usersService.create(data)
  }

  @ResponseMessage('User list fetched successfully')
  @Get()
  findAll(@Query() query: UserQuery) {
    return this.usersService.findAll(query)
  }

  @ResponseMessage('User profile fetched successfully')
  @Get('profile')
  findOne(@CurrentUser('_id') userId: string) {
    return this.usersService.findOne(userId)
  }

  @ResponseMessage('User updated successfully')
  @Patch(':id')
  update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    return this.usersService.update(id, userData)
  }

  @ResponseMessage('User deleted successfully')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id)
  }

  @ResponseMessage('User delivery addresses fetched successfully')
  @Get('delivery/address')
  findAllDeliveryAddress(@CurrentUser('_id') userId: string) {
    return this.usersService.findAllDeliveryAddress(userId)
  }

  @ResponseMessage('User delivery address created successfully')
  @Post('delivery/address')
  createDeliveryAddress(@CurrentUser('_id') userId: string, @Body() data: DeliveryAddressData) {
    return this.usersService.createDeliveryAddress(userId, data)
  }

  @ResponseMessage('User delivery address updated successfully')
  @Patch('delivery/address/:id')
  updateDeliveryAddress(@CurrentUser('_id') userId: string, @Body() data: DeliveryAddressData, @Param('id') id: string) {
    return this.usersService.updateDeliveryAddress(userId, data, id)
  }

  @ResponseMessage('User delivery address deleted successfully')
  @Delete('delivery/address/:id')
  deleteDeliveryAddress(@CurrentUser('_id') userId: string, @Param('id') id: string) {
    return this.usersService.deleteDeliveryAddress(userId, id)
  }
}