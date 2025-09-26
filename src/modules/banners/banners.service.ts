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

  async create(bannerData: BannerData) {
    try {
      const existingBanner = await this.bannerModel.findOne({ order: bannerData.order })
      if (existingBanner) {
        throw new BadRequestException('Banner với thứ tự này đã tồn tại')
      }
      return await this.bannerModel.create({ ...bannerData })
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

  findOne(id: number) { }

  async update(id: string, bannerData: UpdateBannerData) {
    try {
      const banner = await this.bannerModel.findOneAndUpdate({ _id: id }, { ...bannerData }, { new: true })
      if (!banner) throw new NotFoundException('Không tìm thấy banner')
      return banner
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: string) {
    try {
      const banner = await this.bannerModel.findOneAndDelete({ _id: id })
      if (!banner) throw new NotFoundException('Không tìm thấy banner')
      await this.fileService.delete([banner.image])
      return banner
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
