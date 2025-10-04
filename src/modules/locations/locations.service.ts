import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Location, LocationDocument } from './shemas/location.schema'
import { Model } from 'mongoose'

@Injectable()
export class LocationService {
  constructor(@InjectModel(Location.name) private locationModel: Model<LocationDocument>) { }

  async findProvinces() {
    try {
      return await this.locationModel.find().select('-district')
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findDistricts(code: string) {
    try {
      const data = await this.locationModel.aggregate([
        { $match: { type: "province", code } },
        { $unwind: "$district" },
        {
          $project: {
            _id: 0,
            type: "$district.type",
            code: "$district.code",
            name: "$district.name",
            fullName: "$district.fullName",
            codeName: "$district.codeName",
            provinceCode: "$district.provinceCode"
          }
        }
      ])
      return data
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findWards(districtCode: string) {
    try {
      const data = await this.locationModel.aggregate([
        { $unwind: "$district" },
        { $match: { "district.code": districtCode } },
        { $unwind: "$district.ward" },
        {
          $project: {
            _id: 0,
            type: "$district.ward.type",
            code: "$district.ward.code",
            name: "$district.ward.name",
            fullName: "$district.ward.fullName",
            codeName: "$district.ward.codeName",
            districtCode: "$district.ward.districtCode"
          }
        }
      ])
      return data
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
