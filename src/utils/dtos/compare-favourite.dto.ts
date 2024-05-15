import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FavouriteCompareDto {
  @IsOptional()
  @IsString()
  compare: Array<string> | any;
}
