import { PartialType } from '@nestjs/mapped-types'
import { CreateCategoryData } from './create-category.dto'

export class UpdateCategoryData extends PartialType(CreateCategoryData) { }
