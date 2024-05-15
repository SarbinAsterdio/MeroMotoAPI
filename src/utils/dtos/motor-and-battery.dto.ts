import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MotorAndBatteryDto {
  @IsNotEmpty()
  @IsString()
  batteryType: string;
}

export class UpdateMotorAndBatteryDto extends MotorAndBatteryDto {
  @IsOptional()
  @IsString()
  id: string;
}
