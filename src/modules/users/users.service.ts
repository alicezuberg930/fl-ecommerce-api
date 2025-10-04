import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserData } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './schemas/user.schema'
import mongoose, { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { hashPassword } from 'src/common/utils'
import { v4 } from 'uuid'
import dayjs from 'dayjs'
import { UserQuery } from './query/user.query'
import { VerifyDto } from '../auth/dto/verify-auth.dto'
import { MailerService } from '@nestjs-modules/mailer'
import { DeliveryAddressData } from './dto/create-delivery.address.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private mailerService: MailerService) { }

  async isEmailExist(email: string) {
    const isExist = await this.userModel.exists({ email })
    if (isExist) return true
    return false
  }

  async findUserByIdentifier(email: string) {
    return await this.userModel.findOne({ email })
  }

  async create(data: CreateUserData) {
    try {
      if (await this.isEmailExist(data.email)) throw new BadRequestException('Email đã tồn tại')
      const hashedPassword = await hashPassword(data.password)
      return await this.userModel.create({ ...data, password: hashedPassword })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(query: UserQuery) {
    try {
      const currentPage: number = +(query.page ?? 1)
      const pageSize: number = +(query.pageSize ?? 10)
      const skip = (currentPage - 1) * pageSize
      // filter options
      const filter: Record<string, any> = {}
      if (query.name) filter.name = query.name
      const totalUsers = await this.userModel.countDocuments(filter)
      const totalPages = Math.ceil(totalUsers / pageSize)
      const users = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'transactions', // The name of the transactions collection
            localField: '_id', // The field in the user schema
            foreignField: 'userId', // The field in the transaction schema
            as: 'transactions', // The name of the field to store the joined data
          },
        },
        {
          $project: {
            'password': 0,
            'transactions.userId': 0,
          }
        },
      ]).limit(pageSize).skip(skip)
      return {
        data: users,
        paginate: {
          totalPages,
          pageSize,
          currentPage
        }
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(_id: string) {
    try {
      const user = await this.userModel.findById({ _id }).select(['-password'])
      if (!user) throw new NotFoundException('User not found')
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(_id: string, userData: UpdateUserDto) {
    try {
      const user = await this.userModel.findById({ _id })
      if (!user) throw new NotFoundException('Không tìm thấy người dùng')
      return await this.userModel.findOneAndUpdate({ _id }, { ...userData }, { new: true })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async delete(_id: string) {
    try {
      const user = await this.userModel.findOneAndDelete({ _id })
      if (!user) throw new NotFoundException('Không tìm thấy người dùng')
      return user
    } catch (error) {
      throw new BadRequestException(error
      )
    }
  }

  async register(data: CreateUserData) {
    try {
      const { email, password } = data
      if (await this.isEmailExist(email)) throw new BadRequestException('Email đã tồn tại')
      const hashedPassword = await hashPassword(password)
      const user = await this.userModel.create({ ...data, password: hashedPassword, codeId: v4(), codeExpired: dayjs().add(10, 'minutes') })
      await this.sendMail(user)
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async verify(data: VerifyDto) {
    try {
      const user = await this.userModel.findOne({ _id: data.id, codeId: data.code })
      if (!user) throw new BadRequestException('Mã không hợp lệ hoặc hết hạn')
      const isBefore = dayjs().isBefore(user.codeExpired)
      if (isBefore) {
        await this.userModel.updateOne({ _id: data.id }, { isEmailVerified: true })
      } else {
        throw new BadRequestException('Mã đã hết hạn')
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async sendMail(user: mongoose.Document<unknown, {}, User> & User) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Activate your account',
        template: 'verify',
        context: {
          name: user?.name ?? user?.email,
          activationCode: user.codeId
        }
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAllDeliveryAddress(_id: string) {
    try {
      let user = await this.userModel.findById({ _id })
      if (!user) throw new NotFoundException("User not found")
      return user.deliveryAddresses
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async createDeliveryAddress(_id: string, data: DeliveryAddressData) {
    try {
      if (data.isDefault == true) {
        await this.userModel.updateOne(
          { _id, 'deliveryAddresses.isDefault': true },
          { $set: { 'deliveryAddresses.$[].isDefault': false } },
        )
      }
      const user = await this.userModel.findOneAndUpdate({ _id }, { $push: { 'deliveryAddresses': data } }, { new: true })
      return user.deliveryAddresses.at(-1)
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async updateDeliveryAddress(_id: string, data: DeliveryAddressData, id: string) {
    try {
      if (data.isDefault == true) {
        await this.userModel.updateOne(
          { _id, 'deliveryAddresses.isDefault': true },
          { $set: { 'deliveryAddresses.$[].isDefault': false } }
        )
      }
      const address = await this.userModel.findOneAndUpdate(
        { _id, 'deliveryAddresses._id': new Types.ObjectId(id) },
        { $set: { 'deliveryAddresses.$': { ...data, _id: new Types.ObjectId(id) } } },
        { new: true }
      )
      if (!address) throw new NotFoundException('Không tìm thấy địa chỉ')
      return address.deliveryAddresses
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async deleteDeliveryAddress(userId: string, addressId: string) {
    try {
      const user = await this.userModel.findOneAndUpdate({ _id: userId }, { $pull: { deliveryAddresses: { _id: addressId } } }, { new: true })
      if (!user) throw new NotFoundException('Không tìm thấy địa chỉ')
      // return user.deliveryAddresses.find(address => address._id.toString() === addressId)
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}