import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginUserDto, VerifyOtpDto } from './auth.dto';
import {
  AdminResInterface,
  GuestResInterface,
  UserResInterface,
  UserTokenResInterface,
} from './auth.interface';
import { CommonResponse } from 'src/utils/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ADMIN LOGIN
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<CommonResponse<AdminResInterface>> {
    const user = await this.authService.validateAdmin(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.authService.generateToken(user);
    return new CommonResponse<AdminResInterface>(
      HttpStatus.OK,
      'Login Successfully',
      {
        user,
        token,
      },
    );
  }

  // USER LOGIN/SIGNUP
  @Post('user/login')
  async loginUser(
    @Body() loginDto: LoginUserDto,
  ): Promise<CommonResponse<UserResInterface>> {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return new CommonResponse<UserResInterface>(
      HttpStatus.OK,
      'Login Successfully',
      {
        user,
      },
    );
  }

  // VERIFICATION OTP
  @Post('user/verify-otp')
  async verifyOTP(
    // @Req() request: AuthenticatedRequest,
    @Body() otpDto: VerifyOtpDto,
  ): Promise<CommonResponse<UserTokenResInterface>> {
    const user = await this.authService.verifyOTP(
      otpDto.phoneNumber,
      otpDto.otp,
    );
    if (!user) {
      // Handle invalid OTP or user not found error
      throw new BadRequestException('OTP does not match');
    }
    const token = await this.authService.generateToken(user);

    return new CommonResponse<UserTokenResInterface>(
      HttpStatus.OK,
      'OTP verify successfully.',
      {
        user,
        token,
      },
    );
  }
}
