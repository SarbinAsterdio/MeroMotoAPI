/* eslint-disable @typescript-eslint/no-explicit-any */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAvailableColorDto {
  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  color: string | any;

  @IsNotEmpty()
  @IsOptional()
  name: string;
}

export class UpdateAvailableColorDto extends CreateAvailableColorDto {
  @IsOptional()
  @IsString()
  id: string;
}
