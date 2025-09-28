import { PartialType } from '@nestjs/mapped-types';
import { ProductData } from './create-product.dto';

export class UpdateProductData extends PartialType(ProductData) { }
