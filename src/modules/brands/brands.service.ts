import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { BrandData } from './dto/create-brand.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Brand, BrandDocument } from './shemas/brand.schema'
import { Model } from 'mongoose'
import { FileService } from '../files/file.service'
import { UpdateBrandData } from './dto/update-brand.dto'

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<BrandDocument>, private fileService: FileService) { }

  async create(data: BrandData, file: Express.Multer.File) {
    try {
      let logo = null
      if (file) logo = await this.fileService.upload(file, 'brands')
      const brand = await this.brandModel.create({ ...data, logo })
      return brand
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll() {
    try {
      const brands = await this.brandModel.find()
      return brands
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(_id: string) {
    try {
      const brand = await this.brandModel.findOne({ _id })
      if (!brand) throw new NotFoundException('Brand not found')
      return brand
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(_id: string, data: UpdateBrandData, file: Express.Multer.File) {
    try {
      const brand = await this.brandModel.findById({ _id })
      if (!brand) throw new NotFoundException('Brand not found')
      let logo = null
      if (file) {
        logo = await this.fileService.upload(file, 'brands')
        await this.fileService.delete(brand.logo)
      }
      logo = logo != null ? logo : brand.logo
      const updatedBrand = await this.brandModel.findByIdAndUpdate({ _id }, { ...data, logo }, { new: true })
      return updatedBrand
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(_id: string) {
    try {
      const brand = await this.brandModel.findOneAndDelete({ _id })
      if (!brand) throw new NotFoundException('Brand not found')
      await this.fileService.delete(brand.logo)
      return brand
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
