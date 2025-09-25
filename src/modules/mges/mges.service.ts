import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { MGEData } from './dto/create-mge.dto'
import { InjectModel } from '@nestjs/mongoose'
import { MGE, MGEDocument } from './shemas/mges.schema'
import { Model } from 'mongoose'
import { FileService } from '../file/file.service'

@Injectable()
export class MGEsService {
  constructor(@InjectModel(MGE.name) private mgeModel: Model<MGEDocument>, private fileService: FileService) { }

  async create(mgeData: MGEData, files: Array<Express.Multer.File>) {
    try {
      const fileUrls: Record<string, string> = {}
      if (files && files.length > 0) {
        for (const file of files) {
          let tempUrl = await this.fileService.upload([file])
          fileUrls[file.fieldname] = tempUrl[0]
        }
      }
      mgeData.combatTypeSpecialty = JSON.parse(mgeData.combatTypeSpecialty || '[]')
      mgeData.unitTypeSpecialty = JSON.parse(mgeData.unitTypeSpecialty || '[]')
      const mge = await this.mgeModel.create({ ...mgeData, ...fileUrls })
      if (!mge) throw new NotFoundException('MGE Application failed to send')
      return mge
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll() {
    try {
      const applications = await this.mgeModel.find()
      return applications
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: string) {
    try {
      const application = await this.mgeModel.findOne({ governorId: id })
      if (!application) {
        throw new BadRequestException('No application can be found')
      }
      return application
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  // async update(id: string, bannerData: UpdateBannerData) {
  //   try {
  //     const banner = await this.bannerModel.findOneAndUpdate({ _id: id }, { ...bannerData }, { new: true })
  //     if (!banner) throw new NotFoundException('Không tìm thấy banner')
  //     return banner
  //   } catch (error) {
  //     throw new BadRequestException(error)
  //   }
  // }

  async remove(id: string) {
    try {
      // copilot delete all images that this banner model contains
      
      const banner = await this.mgeModel.findOneAndDelete({ _id: id })
      if (!banner) throw new NotFoundException('Không tìm thấy banner')
      // await this.fileService.delete([])
      return banner
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
