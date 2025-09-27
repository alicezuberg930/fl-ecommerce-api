import { PartialType } from '@nestjs/mapped-types';
import { ProductData } from './create-product.dto';

export class UpdatePostData extends PartialType(ProductData) { }
