import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

// create-rating.dto.ts
export class CreateRatingDto {
  @IsNotEmpty()
  @IsString()
  vehicleId: string | any;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  // @IsNumber()
  @Matches(/^(98|97)\d{8}$/, {
    message:
      'Phone number should start with "98" or "97" and have a total of 10 digits',
  })
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  reviewMessage: string;

  @IsBoolean()
  @IsOptional()
  verified: boolean;
}

// update-review.dto.ts (for admin)
export class UpdateReviewDto {
  @IsNotEmpty()
  @IsString()
  reviewMessage: string;
  @IsNotEmpty()
  @IsBoolean()
  verified: boolean;
  @IsNumber()
  @IsNotEmpty()
  rating: number;
}
