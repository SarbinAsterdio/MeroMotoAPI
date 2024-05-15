import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  HttpStatus,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { CommonResponse } from 'src/utils/common';
import { ValidateUUIDDto } from 'src/utils/dtos';
import { CreateBodyTypeDto, UpdateBodyTypeDto } from './bodyType.dto';
import {
  AllBodyType,
  BodyTypeInterface,
  BodyTypeWithCategory,
} from './bodyType.interface';
import { BodyTypeService } from './bodyType.service';

@Controller('body-type')
export class BodyTypeController {
  constructor(private readonly bodyTypeService: BodyTypeService) {}

  @Get()
  async getAllBodyTypes(
    @Query()
    {
      page,
      limit,
      search,
      bodyType,
      category,
      all,
    }: {
      page?: number;
      limit?: number;
      search?: string;
      bodyType?: string;
      category?: string;
      all?: boolean;
    },
    @Req() request,
  ): Promise<CommonResponse<AllBodyType>> {
    const key = request?.originalUrl;
    const bodyTypes = await this.bodyTypeService.getAllBodyTypes(
      page,
      limit,
      search,
      bodyType,
      category,
      all,
      key,
    );
    return new CommonResponse<AllBodyType>(
      HttpStatus.OK,
      'Body types found successfully',
      bodyTypes,
    );
  }

  @Post()
  @UseGuards(AuthGuard('admin-jwt'))
  async createBodyType(
    @Body() createBodyTypeDto: CreateBodyTypeDto,
  ): Promise<CommonResponse<BodyTypeInterface>> {
    const bodyType =
      await this.bodyTypeService.createBodyType(createBodyTypeDto);
    return new CommonResponse<BodyTypeInterface>(
      HttpStatus.CREATED,
      'Body type created successfully',
      bodyType,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateBodyType(
    @Param() param: ValidateUUIDDto,
    @Body() updateBodyTypeDto: UpdateBodyTypeDto,
  ): Promise<CommonResponse<BodyTypeInterface>> {
    const bodyType = await this.bodyTypeService.getBodyTypeById(param?.id);
    if (!bodyType) throw new NotFoundException('Body type not found!');
    const updateBodyType = await this.bodyTypeService.updateBodyType(
      param?.id,
      updateBodyTypeDto,
    );
    return new CommonResponse<BodyTypeInterface>(
      HttpStatus.OK,
      'Body type updated successfully',
      updateBodyType,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async deleteBodyType(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    const bodyType = await this.bodyTypeService.deleteBodyType(param?.id);
    if (bodyType == true) {
      return new CommonResponse(
        HttpStatus.OK,
        'Body type deleted successfully',
      );
    }
    return new CommonResponse(
      206,
      'Cannot delete body type. Remove or change its dependencies to delete it',
      bodyType,
    );
  }

  @Get('/by-category')
  async getALlBodyTypesByCategory(
    @Query()
    { category, bodyType }: { category: string; bodyType: string },
    @Req() request,
  ) {
    const key = request?.originalUrl;
    const response = this.bodyTypeService.getBodyTypeByCategory(
      category,
      bodyType,
      key,
    );
    return response;
  }

  @Get(':id')
  async getBodyTypeById(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<BodyTypeWithCategory>> {
    const bodyType = await this.bodyTypeService.getBodyTypeById(param?.id);
    if (!bodyType) throw new NotFoundException('BodyType not found!');
    return new CommonResponse<BodyTypeWithCategory>(
      HttpStatus.OK,
      'Body type find successfully',
      bodyType,
    );
  }
}
