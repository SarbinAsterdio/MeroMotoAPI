import { Optional } from '@nestjs/common';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { From } from '../utils/common';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsEnum(From)
  from: From;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10, {
    message: 'Phone number must be exactly 10 characters long.',
  })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  role?: string | any;
}

export class UpdateUserDto {
  @Optional()
  id?: string;

  @Optional()
  slug?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @Optional()
  bio: string;
}
