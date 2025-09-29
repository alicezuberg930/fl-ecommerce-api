import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { BannerData } from './dto/create-banner.dto'
import { UpdateBannerData } from './dto/update-banner.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Banner, BannerDocument } from './shemas/banner.schema'
import { Model } from 'mongoose'
import { FileService } from '../files/file.service'

@Injectable()
export class BannersService {
  constructor(@InjectModel(Banner.name) private bannerModel: Model<BannerDocument>, private fileService: FileService) { }

  async create(data: BannerData, file: Express.Multer.File) {
    try {
      const existingBanner = await this.bannerModel.findOne({ order: data.order })
      if (existingBanner) throw new BadRequestException('Banner với thứ tự này đã tồn tại')
      let image = null
      if (file) image = await this.fileService.upload(file, 'banners')
      return await this.bannerModel.create({ ...data, image })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll() {
    try {
      const banners = await this.bannerModel.find().sort({ order: 1 })
      return banners
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findOne(_id: number) { }

  async update(_id: string, data: UpdateBannerData) {
    try {
      const banner = await this.bannerModel.findOneAndUpdate({ _id }, { ...data }, { new: true })
      if (!banner) throw new NotFoundException('Banner not found')
      return banner
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(_id: string) {
    try {
      const banner = await this.bannerModel.findOneAndDelete({ _id })
      if (!banner) throw new NotFoundException('Banner not found')
      await this.fileService.delete(banner.image)
      return banner
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
