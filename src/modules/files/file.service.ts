import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary'
import { UploadApiResponse } from 'cloudinary'
import * as fs from 'fs'

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    })
  }

  async upload(files: Express.Multer.File[] | Express.Multer.File, subFolder?: string): Promise<string | string[]> {
    try {
      const tempFiles = Array.isArray(files) ? files : [files]
      const uploadPromises = tempFiles.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: `future-life${subFolder ? `/${subFolder}` : ''}`,
          resource_type: 'image',
        }),
      );
      // upload all files concurrently
      const uploadResults: UploadApiResponse[] = await Promise.all(uploadPromises);
      // Extract URLs from results
      const fileUrls = uploadResults.map((result) => result.secure_url);
      // Delete all local files concurrently
      await Promise.all(
        tempFiles.map((file) =>
          fs.unlink(file.path, (err) => {
            if (err) console.error(`Error deleting file ${file.path} :${err.message}`);
          })
        )
      )
      return fileUrls.length > 1 ? fileUrls : fileUrls[0];
    } catch (error) {
      throw new BadRequestException(error)
    }

    // console.log(uploadResult)
    // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //   fetch_format: 'auto',
    //   quality: 'auto'
    // })
    // console.log(optimizeUrl)
    // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //   crop: 'auto',
    //   gravity: 'auto',
    //   width: 500,
    //   height: 500,
    // })
    // console.log(autoCropUrl)
  }

  extractPublidId(url: string) {
    return url.split('/').slice(-3).join('/').replace(/\.[^/.]+$/, '')
  }

  async delete(fileUrls: string | string[]): Promise<void> {
    try {
      let tempURLs = Array.isArray(fileUrls) ? fileUrls : [fileUrls]
      await Promise.all(tempURLs.map(url => cloudinary.uploader.destroy(this.extractPublidId(url))))
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}