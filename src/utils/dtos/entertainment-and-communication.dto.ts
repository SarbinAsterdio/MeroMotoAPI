import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Speakers } from '../common/variant.enum';

export class EntertainmentAndCommunicationDto {
  @IsOptional()
  @IsBoolean()
  externalSpeakers: boolean | null;

  @IsOptional()
  @IsBoolean()
  radio: boolean | null;

  @IsOptional()
  @IsBoolean()
  speakersFront: boolean | null;

  @IsOptional()
  @IsBoolean()
  speakersRear: boolean | null;

  @IsOptional()
  @IsBoolean()
  integrated2DINAudio: boolean | null;

  @IsOptional()
  @IsBoolean()
  usbAndAuxiliaryInput: boolean | null;

  @IsOptional()
  @IsBoolean()
  bluetoothConnectivity: boolean | null;

  @IsOptional()
  @IsBoolean()
  touchScreen: boolean | null;

  @IsOptional()
  @IsNumber()
  touchScreenSize: number | null;

  @IsOptional()
  @IsBoolean()
  connectivity: boolean | null;

  @IsOptional()
  @IsBoolean()
  androidAuto: boolean | null;

  @IsOptional()
  @IsBoolean()
  appleCarPlay: boolean | null;

  @IsOptional()
  @IsEnum(Speakers)
  noOfSpeakers: Speakers;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalFeatures: Array<string> | null;
}

export class UpdateEntertainmentAndCommunicationDto extends EntertainmentAndCommunicationDto {
  @IsOptional()
  @IsString()
  id: string;
}
