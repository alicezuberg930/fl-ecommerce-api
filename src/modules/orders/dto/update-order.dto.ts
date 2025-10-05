import { PartialType } from '@nestjs/mapped-types';
import { OrderData } from './create-order.dto';

export class UpdateOrderData extends PartialType(OrderData) { }
