import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCallBackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(98|97)\d{8}$/, {
    message:
      'Phone number should start with "98" or "97" and have a total of 10 digits',
  })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vehicle: string | any;

  @IsOptional()
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  brand: string | any;
}

export class UpdateCallBackDto extends CreateCallBackDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  remarks: string;
}

export class UpdateRemarksCallBackDto {
  @IsNotEmpty()
  @IsString()
  remarks: string;
}

export class UpdateVerifiedDto {
  @IsNotEmpty()
  @IsBoolean()
  verified: boolean;
}
