import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from '../../common/decorators/public.decorator';
import { VerifyData } from './dto/verify-auth.dto';
import { CreateUserData } from '../users/dto/create-user.dto';
import { LoginData } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post("login")
  @ResponseMessage("User login successfully")
  login(@Body() request: LoginData) {
    return this.authService.login(request)
  }

  @ResponseMessage('Check your email to verify your account')
  @Public()
  @Post("register")
  register(@Body() data: CreateUserData) {
    return this.authService.register(data)
  }

  @ResponseMessage('User verification successfully')
  @Public()
  @Post("verify")
  @ResponseMessage("Xác thực mã thành công")
  verifyAccount(@Body() data: VerifyData) {
    return this.authService.verifyAccount(data)
  }

  @ResponseMessage('User verification code resent')
  @Public()
  @Post("resend")
  @ResponseMessage("Verification resent")
  resendMail(@Body() data: any) {
    return this.authService.resendMail(data)
  }
}