import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10, {
    message: 'Phone number must be exactly 10 characters long.',
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  from: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 10, {
    message: 'Phone number must be exactly 10 characters long.',
  })
  phoneNumber: string;

  @IsNotEmpty()
  otp: number;
}
