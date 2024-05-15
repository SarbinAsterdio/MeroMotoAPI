import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BrandInterface } from '../utils/interfaces';

export class FaqEntryDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;

  @IsOptional()
  model: string | any;
}

export class CreateFaqDto {
  @IsNotEmpty()
  brand: string | any;

  @IsArray()
  entries: FaqEntryDto[];
}

export class UpdateFeaturedFaqDto {
  @IsNotEmpty()
  featured: boolean;
}

export class UpdateFaqDto {
  @IsString({ message: 'Question Must Be A String.' })
  @IsOptional()
  question: string;

  @IsString({ message: 'Answer Must Be A String.' })
  @IsOptional()
  answer: string;

  @IsNotEmpty()
  brand: string | any;

  @IsOptional()
  model: string | any;
}
