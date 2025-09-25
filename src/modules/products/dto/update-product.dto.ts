import { PartialType } from '@nestjs/mapped-types';
import { PostData } from './create-product.dto';

export class UpdatePostData extends PartialType(PostData) { }
