import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class InteriorDto {
  @IsBoolean()
  @IsOptional()
  leatherSeats?: boolean;

  @IsBoolean()
  @IsOptional()
  leatherSteeringWheel?: boolean;

  @IsBoolean()
  @IsOptional()
  electronicMultiTripmeter?: boolean;

  @IsBoolean()
  @IsOptional()
  fabricUpholstery?: boolean;

  @IsBoolean()
  @IsOptional()
  gloveCompartment?: boolean;

  @IsBoolean()
  @IsOptional()
  digitalOdometer?: boolean;

  @IsBoolean()
  @IsOptional()
  heightAdjustableDriverSeat?: boolean;

  @IsBoolean()
  @IsOptional()
  dualToneDashboard?: boolean;

  @IsBoolean()
  @IsOptional()
  digitalClock?: boolean;

  @IsArray()
  @IsOptional()
  images?: Array<string>;

  @IsArray()
  @IsOptional()
  additionalFeatures?: string[] | null;
}

export class UpdateInteriorDto extends InteriorDto {
  @IsOptional()
  @IsString()
  id: string;
}
