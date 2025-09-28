import { Controller, Post, UseInterceptors, UploadedFiles, Body } from '@nestjs/common'
import { FileService } from './file.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ResponseMessage } from 'src/common/decorators/public.decorator'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @ResponseMessage("Tải file lên thành công")
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async upload(@UploadedFiles() files: Express.Multer.File[], @Body() subFolder: string) {
    return this.fileService.upload(files, subFolder ?? undefined)
  }
}
