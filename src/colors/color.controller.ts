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
import { CreateColorDto, UpdateColorDto } from './color.dto';
import { AllColor, ColorInterface } from './color.interface';
import { ColorService } from './color.service';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get()
  async getAllColors(
    @Query()
    {
      page,
      limit,
      search,
      all,
    }: { page: number; limit: number; search: string; all: boolean },
    @Req() request,
  ): Promise<CommonResponse<AllColor>> {
    const key = request?.originalUrl;
    const colors = await this.colorService.getAllColors(
      page,
      limit,
      search,
      all,
      key,
    );
    return new CommonResponse<AllColor>(
      HttpStatus.OK,
      'Colors find successfully',
      colors,
    );
  }

  @Get(':id')
  async getColorById(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<ColorInterface>> {
    const color = await this.colorService.getColorById(param?.id);
    if (!color) throw new NotFoundException('Color not found!');
    return new CommonResponse<ColorInterface>(
      HttpStatus.OK,
      'Color find successfully',
      color,
    );
  }

  @Post()
  @UseGuards(AuthGuard('admin-jwt'))
  async createColor(
    @Body() createColorDto: CreateColorDto,
  ): Promise<CommonResponse<ColorInterface>> {
    const color = await this.colorService.createColor(createColorDto);
    return new CommonResponse<ColorInterface>(
      HttpStatus.CREATED,
      'Color created successfully',
      color,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateColor(
    @Param() param: ValidateUUIDDto,
    @Body() updateColorDto: UpdateColorDto,
  ): Promise<CommonResponse<ColorInterface>> {
    const color = await this.colorService.getColorById(param?.id);
    if (!color) throw new NotFoundException('Color not found!');
    const updateColor = await this.colorService.updateColor(
      param?.id,
      updateColorDto,
    );
    return new CommonResponse<ColorInterface>(
      HttpStatus.OK,
      'Color updated successfully',
      updateColor,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async deleteColor(
    @Param() param: ValidateUUIDDto,
  ): Promise<CommonResponse<string>> {
    const color = await this.colorService.deleteColor(param?.id);
    if (color == true) {
      return new CommonResponse(HttpStatus.OK, 'Color deleted successfully');
    }
    return new CommonResponse(
      206,
      'Cannot delete color. Remove or change its dependencies to delete it.',
      color,
    );
  }
}
