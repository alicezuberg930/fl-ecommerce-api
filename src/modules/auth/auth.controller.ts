import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, ParseFilePipe, ParseFilePipeBuilder, Post, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from 'src/common/decorators/public.decorator';
import { VerifyDto } from './dto/verify-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("login")
  @ResponseMessage("Đăng nhập thành công")
  login(@Request() request: any) {
    return this.authService.login(request.user)
  }

  @Public()
  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Public()
  @Post("verify")
  @ResponseMessage("Xác thực mã thành công")
  verify(@Body() data: VerifyDto) {
    return this.authService.verify(data)
  }
}