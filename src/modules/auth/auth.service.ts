import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { comparePassword } from 'src/common/utils'
import { JwtService } from '@nestjs/jwt'
import mongoose from 'mongoose'
import { User } from '../users/schemas/user.schema'
import { VerifyDto } from './dto/verify-auth.dto'
import { CreateUserData } from '../users/dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  async validateUser(identifier: string, pass: string): Promise<mongoose.Document<unknown, {}, User> & User> {
    const user = await this.usersService.findUserByIdentifier(identifier)
    if (!user) return null
    const checkPassword = await comparePassword(pass, user.password)
    if (!checkPassword) return null
    return user
  }

  async login(user: mongoose.Document<unknown, {}, User> & User) {
    const { _id, email, name, phone, avatar } = user
    const payload = { _id, email }
    return {
      accessToken: this.jwtService.sign(payload),
      user: { _id, email, name, phone, avatar }
    }
  }

  async register(registerDto: CreateUserData) {
    return await this.usersService.register(registerDto)
  }

  async verify(data: VerifyDto) {
    return await this.usersService.verify(data)
  }
}
