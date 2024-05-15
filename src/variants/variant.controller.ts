import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { CommonResponse } from 'src/utils/common';
import {
  ValidateUUIDDto,
  CreateVariantDto,
  UpdateVariantDto,
} from 'src/utils/dtos';
import { VariantWithSpecs, ALlVariants } from 'src/utils/interfaces';
import { VariantService } from './variant.service';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Get()
  async getAllVariant(
    @Query()
    {
      page,
      limit,
      model,
      category,
      search,
      minPrice,
      maxPrice,
      all,
    }: {
      page: number;
      limit: number;
      model: string;
      category: string;
      search: string;
      minPrice: number;
      maxPrice: number;
      all: boolean;
    },
  ): Promise<CommonResponse<ALlVariants>> {
    const getAllVariants = await this.variantService.getAllVariants(
      page,
      limit,
      model,
      category,
      search,
      minPrice,
      maxPrice,
      all,
    );
    return new CommonResponse(
      HttpStatus.OK,
      'Variants retrieved successfully',
      getAllVariants,
    );
  }

  @Get(':id')
  async getOneVariant(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<VariantWithSpecs>> {
    const variant = await this.variantService.getOneVariant(param?.id);
    return new CommonResponse(HttpStatus.OK, 'Variant Found', variant);
  }

  @Post()
  @UseGuards(AuthGuard('admin-jwt'))
  async addNewVariant(
    @Body() createVariantDto: CreateVariantDto,
  ): Promise<CommonResponse<any>> {
    const { message, variant } =
      await this.variantService.createVariant(createVariantDto);
    return new CommonResponse(HttpStatus.CREATED, message, variant);
  }

  @Put(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateVariant(
    @Param() param: ValidateUUIDDto,
    @Body() updateVariantDto: UpdateVariantDto,
  ): Promise<CommonResponse<any>> {
    await this.variantService.getOneVariant(param?.id);
    const { message, variant } = await this.variantService.updateVariant(
      param?.id,
      updateVariantDto,
    );
    return new CommonResponse(HttpStatus.OK, message, variant);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async deleteVariant(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    await this.variantService.deleteVariant(param?.id);
    return new CommonResponse(HttpStatus.OK, 'Variant deleted successfully');
  }

  @Get('/variants-by-model/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  async getallVariantsByModel(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<any>> {
    const variants = await this.variantService.getVariantsByModelId(param?.id);
    return new CommonResponse(HttpStatus.OK, 'all', variants);
  }
}
