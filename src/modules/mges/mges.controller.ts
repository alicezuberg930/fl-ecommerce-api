import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException } from '@nestjs/common'
import { MGEsService } from './mges.service'
import { ResponseMessage } from 'src/common/decorators/public.decorator'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { MGEData } from './dto/create-mge.dto';

const multerOptions: MulterOptions = {
  limits: { fileSize: 5000000 }, // 5 MB limit (5,000,000 bytes)
  fileFilter: (req, file, callback) => {
    // Optional: Restrict to specific file types (e.g., images)
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = file.originalname.split('.').pop().toLowerCase();
    const mimetype = allowedTypes.test(file.mimetype);
    if (ext && mimetype) {
      callback(null, true);
    } else {
      callback(new BadRequestException('Only images (jpg, jpeg, png, gif) are allowed'), false);
    }
    // Optional: Validate field names
    const allowedFields = [
      'profileImage',
      'equipmentImage',
      'resourcesImage',
      'speedupsImage',
    ];
    if (!allowedFields.includes(file.fieldname)) {
      callback(new BadRequestException(`Invalid field name: ${file.fieldname}`), false);
    }
  },
};

@Controller('mges')
export class MGEsController {
  constructor(private readonly mgesService: MGEsService) { }

  @ResponseMessage('MGE Application sent successfully')
  @Post()
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async create(@UploadedFiles() files: Array<Express.Multer.File>, @Body() mgeData: MGEData) {
    return this.mgesService.create(mgeData, files)
  }

  @ResponseMessage('MGE Application list retrieved successfully')
  @Get()
  findAll() {
    return this.mgesService.findAll()
  }

  @ResponseMessage('MGE Application details retrieved successfully')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mgesService.findOne(id)
  }

  // @ResponseMessage('Cập nhật banner thành công')
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() bannerData: UpdateBannerData) {
  //   return this.mgesService.update(id, bannerData)
  // }

  @ResponseMessage('Xóa banner thành công')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mgesService.remove(id)
  }
}
