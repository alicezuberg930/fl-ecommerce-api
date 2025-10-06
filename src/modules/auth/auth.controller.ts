import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, ParseFilePipe, ParseFilePipeBuilder, Post, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from 'src/common/decorators/public.decorator';
import { VerifyDto } from './dto/verify-auth.dto';
import { CreateUserData } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("login")
  @ResponseMessage("User login successfully")
  login(@Request() request: any) {
    return this.authService.login(request.user)
  }

  @ResponseMessage('User registration successfully')
  @Public()
  @Post("register")
  register(@Body() data: CreateUserData) {
    return this.authService.register(data)
  }

  @ResponseMessage('User verification successfully')
  @Public()
  @Post("verify")
  @ResponseMessage("Xác thực mã thành công")
  verify(@Body() data: VerifyDto) {
    return this.authService.verify(data)
  }

  @ResponseMessage('User verification code resent')
  @Public()
  @Post("resend")
  @ResponseMessage("Verification resent")
  resend(@Body() data: any) {
    return this.authService.resend(data)
  }
}