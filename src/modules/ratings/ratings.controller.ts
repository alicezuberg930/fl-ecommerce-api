import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common'
import { RatingService } from './ratings.service'
import { Public, ResponseMessage } from 'src/common/decorators/public.decorator'
import { FilesInterceptor } from '@nestjs/platform-express'
import { RatingData } from './dto/create-rating.dto';
import { multerOptions } from 'src/common/helpers/options/multer.options';
import { CurrentUser } from 'src/common/decorators/id.decorator';
import { QueryRating } from './dto/query-rating';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingsService: RatingService) { }

  @ResponseMessage('Rating created successfully')
  @Post()
  @UseInterceptors(FilesInterceptor("images", Infinity, multerOptions({ allowedFields: [] })))
  async create(@UploadedFiles() files: Express.Multer.File[], @Body() data: RatingData, @CurrentUser('_id') userId: string) {
    return this.ratingsService.create(data, files, userId)
  }

  @ResponseMessage('Rating list retrieved successfully')
  @Public()
  @Get()
  findAll(@Query() query: QueryRating) {
    return this.ratingsService.findAll(query)
  }

  @ResponseMessage('Rating details retrieved successfully')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(id)
  }

  @ResponseMessage('Rating updated successfully')
  @Patch(':id')
  @UseInterceptors(FilesInterceptor("images", Infinity, multerOptions({ allowedFields: [] })))
  update(@Param('id') id: string, @Body() data: RatingData, @UploadedFiles() files: Express.Multer.File[]) {
    return this.ratingsService.update(id, data, files)
  }

  @ResponseMessage('Rating deleted successfully')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratingsService.remove(id)
  }
}