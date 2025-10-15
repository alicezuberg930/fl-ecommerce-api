import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { comparePassword, separateNumberAndLetter } from '../../common/crypto'
import { JwtService } from '@nestjs/jwt'
import { VerifyData } from './dto/verify-auth.dto'
import { CreateUserData } from '../users/dto/create-user.dto'
import { LoginData } from './dto/login.dto'
import { Provider } from '../users/schemas/enum'
import { User, UserDocument } from '../users/schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import dayjs, { ManipulateType } from 'dayjs'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async login(data: LoginData) {
    const { email, provider, password, name, avatar } = data
    let user = await this.userModel.findOne({ email, provider })
    if (user) {
      if (provider == Provider.credentials) {
        if (!user.isEmailVerified) throw new UnauthorizedException("Account is not activated")
        const isPasswordCorrect = await comparePassword(password, user.password)
        if (!isPasswordCorrect) throw new UnauthorizedException('Password is not correct')
      }
    } else {
      if (provider == Provider.credentials) throw new UnauthorizedException('User not found')
      else user = await this.userModel.create({ ...data, isEmailVerified: true })
    }
    const expiredDate = separateNumberAndLetter(process.env.JWT_EXPIRED_IN)
    return {
      accessToken: this.jwtService.sign({ _id: user._id }),
      expiresIn: dayjs().add(expiredDate.number, expiredDate.unit as ManipulateType),
      user: { email, provider, name, avatar, isEmailVerified: user.isEmailVerified }
    }
  }

  async register(registerDto: CreateUserData) {
    return await this.usersService.create(registerDto)
  }

  async verifyAccount(data: VerifyData) {
    return await this.usersService.verifyAccount(data)
  }

  async resendMail(data: any) {
    return await this.usersService.resendMail(data)
  }
}
