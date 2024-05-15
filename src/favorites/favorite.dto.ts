import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  //  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  isFavorite: boolean;

  @IsNotEmpty()
  vehicleId: string;
}
